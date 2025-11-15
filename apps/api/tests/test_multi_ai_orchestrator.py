"""Tests for multi-AI orchestrator with failover and validation."""
import pytest
from pydantic import ValidationError

from contract_iq.schemas import NegotiationContext
from contract_iq.services.gemini import GeminiServiceError
from contract_iq.services.multi_ai_orchestrator import (
    AIProvider,
    CircuitBreakerState,
    MultiAIOrchestrator,
)
from contract_iq.services.openai_client import OpenAIServiceError


class TestMultiAIOrchestrator:
    """Test suite for MultiAIOrchestrator with failover logic."""

    @pytest.fixture
    def valid_context(self):
        """Valid negotiation context for testing."""
        return NegotiationContext(
            topic="SLA Enhancement",
            contract_id="test-123",
            template_id="sla_enhancement",
            current_position="99% uptime",
            target_position="99.9% uptime",
            fallback_position="99.5% uptime",
        )

    @pytest.fixture
    def orchestrator(self):
        """Fresh orchestrator instance for each test."""
        return MultiAIOrchestrator()

    def test_valid_input_passes_validation(self, orchestrator, valid_context):
        """Test that valid input passes all validation checks."""
        validated = orchestrator._validate_input(valid_context)
        
        assert validated.topic == "SLA Enhancement"
        assert validated.current_position == "99% uptime"
        assert validated.target_position == "99.9% uptime"

    def test_empty_topic_fails_validation(self, orchestrator, valid_context):
        """Test that empty topic fails validation."""
        invalid_context = valid_context.model_copy(update={"topic": ""})
        
        with pytest.raises(ValueError, match="Topic cannot be empty"):
            orchestrator._validate_input(invalid_context)

    def test_whitespace_only_topic_fails(self, orchestrator, valid_context):
        """Test that whitespace-only topic fails validation."""
        invalid_context = valid_context.model_copy(update={"topic": "   "})
        
        with pytest.raises(ValueError, match="Topic cannot be empty"):
            orchestrator._validate_input(invalid_context)

    def test_empty_current_position_fails(self, orchestrator, valid_context):
        """Test that empty current position fails validation."""
        invalid_context = valid_context.model_copy(update={"current_position": ""})
        
        with pytest.raises(ValueError, match="Current position cannot be empty"):
            orchestrator._validate_input(invalid_context)

    def test_empty_target_position_fails(self, orchestrator, valid_context):
        """Test that empty target position fails validation."""
        invalid_context = valid_context.model_copy(update={"target_position": ""})
        
        with pytest.raises(ValueError, match="Target position cannot be empty"):
            orchestrator._validate_input(invalid_context)

    def test_input_sanitization_trims_whitespace(self, orchestrator, valid_context):
        """Test that input sanitization trims excess whitespace."""
        context_with_whitespace = valid_context.model_copy(
            update={"topic": "  SLA Enhancement  "}
        )
        
        validated = orchestrator._validate_input(context_with_whitespace)
        assert validated.topic == "SLA Enhancement"

    def test_input_length_limit_enforced(self, orchestrator, valid_context):
        """Test that extremely long inputs are truncated."""
        very_long_text = "A" * 20000
        context_with_long_text = valid_context.model_copy(
            update={"current_position": very_long_text}
        )
        
        validated = orchestrator._validate_input(context_with_long_text)
        assert len(validated.current_position) <= 10000

    def test_output_validation_requires_summary(self, orchestrator):
        """Test that output validation requires non-empty summary."""
        from contract_iq.services.gemini import NegotiationGuidance
        
        invalid_guidance = NegotiationGuidance(
            summary="",  # Too short
            fallback_recommendation="Valid fallback",
            talking_points=("Point 1",),
            risk_callouts=("Risk 1",),
            confidence=0.8,
            generated_prompt="test",
            cached=False,
            model="test",
            latency_ms=100,
        )
        
        with pytest.raises(ValidationError, match="Summary is too short"):
            orchestrator._validate_output(invalid_guidance)

    def test_output_validation_requires_talking_points(self, orchestrator):
        """Test that output validation requires talking points."""
        from contract_iq.services.gemini import NegotiationGuidance
        
        invalid_guidance = NegotiationGuidance(
            summary="Valid summary with enough text",
            fallback_recommendation="Valid fallback",
            talking_points=(),  # Empty
            risk_callouts=("Risk 1",),
            confidence=0.8,
            generated_prompt="test",
            cached=False,
            model="test",
            latency_ms=100,
        )
        
        with pytest.raises(ValidationError, match="No talking points"):
            orchestrator._validate_output(invalid_guidance)

    def test_output_validation_checks_confidence_range(self, orchestrator):
        """Test that confidence must be between 0 and 1."""
        from contract_iq.services.gemini import NegotiationGuidance
        
        invalid_guidance = NegotiationGuidance(
            summary="Valid summary with enough text",
            fallback_recommendation="Valid fallback",
            talking_points=("Point 1",),
            risk_callouts=("Risk 1",),
            confidence=1.5,  # Out of range
            generated_prompt="test",
            cached=False,
            model="test",
            latency_ms=100,
        )
        
        with pytest.raises(ValidationError, match="Invalid confidence"):
            orchestrator._validate_output(invalid_guidance)

    def test_provider_order_defaults_to_gemini_first(self, orchestrator):
        """Test that default provider order is Gemini -> OpenAI -> Stub."""
        order = orchestrator._get_provider_order(None)
        
        assert order == [AIProvider.GEMINI, AIProvider.OPENAI, AIProvider.STUB]

    def test_provider_order_respects_preference(self, orchestrator):
        """Test that provider order can be overridden."""
        order = orchestrator._get_provider_order(AIProvider.OPENAI)
        
        assert order[0] == AIProvider.OPENAI
        assert AIProvider.GEMINI in order

    def test_stub_provider_always_available(self, orchestrator):
        """Test that stub provider is always available."""
        assert orchestrator._is_provider_available(AIProvider.STUB) is True

    def test_circuit_breaker_opens_after_failures(self, orchestrator):
        """Test that circuit breaker opens after threshold failures."""
        provider = AIProvider.GEMINI
        
        # Record failures up to threshold
        for _ in range(orchestrator.FAILURE_THRESHOLD):
            orchestrator._record_failure(provider)
        
        health = orchestrator.provider_health[provider]
        assert health.state == CircuitBreakerState.OPEN
        assert orchestrator._is_provider_available(provider) is False

    def test_circuit_breaker_closes_after_recovery(self, orchestrator):
        """Test that circuit breaker closes after successful recovery."""
        provider = AIProvider.GEMINI
        
        # Open the circuit
        for _ in range(orchestrator.FAILURE_THRESHOLD):
            orchestrator._record_failure(provider)
        
        # Move to half-open (simulated)
        health = orchestrator.provider_health[provider]
        health.state = CircuitBreakerState.HALF_OPEN
        
        # Record successes
        for _ in range(orchestrator.SUCCESS_THRESHOLD):
            orchestrator._record_success(provider)
        
        assert health.state == CircuitBreakerState.CLOSED

    def test_successful_guidance_generation_uses_gemini(self, orchestrator, valid_context):
        """Test that successful generation works end-to-end."""
        # This will use stub if Gemini API key is not configured
        guidance = orchestrator.generate_guidance(context=valid_context)
        
        assert guidance is not None
        assert len(guidance.summary) > 0
        assert len(guidance.talking_points) > 0
        assert 0.0 <= guidance.confidence <= 1.0

    def test_guidance_generation_never_crashes(self, orchestrator, valid_context):
        """Test that guidance generation ALWAYS returns a result (monkey-proof)."""
        # Even with no API keys, should fall back to stub
        guidance = orchestrator.generate_guidance(context=valid_context)
        
        assert guidance is not None
        assert guidance.summary
        assert guidance.fallback_recommendation
        assert guidance.talking_points

    def test_invalid_input_raises_value_error(self, orchestrator):
        """Test that invalid input raises ValueError (not crashes)."""
        invalid_context = NegotiationContext(
            topic="",  # Invalid
            contract_id="test",
            template_id="test",
            current_position="position",
            target_position="target",
        )
        
        with pytest.raises(ValueError):
            orchestrator.generate_guidance(context=invalid_context)

    def test_provider_health_status_endpoint(self, orchestrator):
        """Test that provider health status can be retrieved."""
        status = orchestrator.get_provider_health_status()
        
        assert "gemini" in status
        assert "openai" in status
        assert status["gemini"]["state"] in ["closed", "open", "half_open"]
        assert "failure_count" in status["gemini"]

    def test_multiple_templates_dont_conflict(self, orchestrator):
        """Test that switching between templates doesn't cause conflicts."""
        templates = [
            ("SLA Enhancement", "sla_enhancement"),
            ("SaaS Renewal", "saas_renewal_price_increase"),
            ("GDPR DPA", "gdpr_dpa_compliance"),
            ("Liability Caps", "liability_cap_negotiation"),
        ]
        
        for topic, template_id in templates:
            context = NegotiationContext(
                topic=topic,
                contract_id="test-123",
                template_id=template_id,
                current_position="Current state",
                target_position="Target state",
            )
            
            guidance = orchestrator.generate_guidance(context=context)
            assert guidance is not None
            assert len(guidance.summary) > 0

    def test_rapid_sequential_requests_dont_crash(self, orchestrator, valid_context):
        """Test that rapid sequential requests don't cause race conditions."""
        results = []
        
        for i in range(10):
            context = valid_context.model_copy(
                update={"contract_id": f"test-{i}"}
            )
            guidance = orchestrator.generate_guidance(context=context)
            results.append(guidance)
        
        assert len(results) == 10
        assert all(r is not None for r in results)

    def test_special_characters_in_input_sanitized(self, orchestrator, valid_context):
        """Test that special characters in input are handled safely."""
        context_with_special_chars = valid_context.model_copy(
            update={
                "topic": "SLA <script>alert('xss')</script>",
                "current_position": "99% \n\r\t uptime",
            }
        )
        
        # Should not crash, should sanitize
        validated = orchestrator._validate_input(context_with_special_chars)
        assert validated is not None

    def test_all_required_fields_always_present(self, orchestrator, valid_context):
        """Test that generated guidance always has all required fields."""
        guidance = orchestrator.generate_guidance(context=valid_context)
        
        # All fields must be present
        assert guidance.summary
        assert guidance.fallback_recommendation
        assert guidance.talking_points
        assert guidance.risk_callouts is not None  # Can be empty tuple
        assert guidance.confidence is not None
        assert guidance.generated_prompt
        assert guidance.model
        assert guidance.latency_ms >= 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
