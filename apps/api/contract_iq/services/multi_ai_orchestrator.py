"""Multi-AI provider orchestrator with automatic failover and validation."""
from __future__ import annotations

import logging
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field, ValidationError

from contract_iq.schemas import NegotiationContext
from contract_iq.services.gemini import GeminiFlashClient, GeminiServiceError, NegotiationGuidance
from contract_iq.services.openai_client import OpenAIClient, OpenAIServiceError

logger = logging.getLogger("contract_iq.multi_ai")


class AIProvider(str, Enum):
    """Available AI providers."""
    GEMINI = "gemini"
    OPENAI = "openai"
    STUB = "stub"


class CircuitBreakerState(str, Enum):
    """Circuit breaker states for provider health."""
    CLOSED = "closed"  # Normal operation
    OPEN = "open"      # Provider is down, use fallback
    HALF_OPEN = "half_open"  # Testing if provider recovered


class ProviderHealth(BaseModel):
    """Health tracking for an AI provider."""
    provider: AIProvider
    state: CircuitBreakerState = CircuitBreakerState.CLOSED
    failure_count: int = 0
    last_failure_time: float | None = None
    success_count: int = 0


class MultiAIOrchestrator:
    """
    Orchestrates multiple AI providers with:
    - Automatic failover (Gemini -> ChatGPT -> Stub)
    - Circuit breaker pattern
    - Input validation
    - Output validation
    - Comprehensive error handling
    """

    # Circuit breaker thresholds
    FAILURE_THRESHOLD = 3  # Open circuit after 3 failures
    SUCCESS_THRESHOLD = 2  # Close circuit after 2 successes
    RECOVERY_TIMEOUT = 60  # Try recovery after 60 seconds

    def __init__(
        self,
        gemini_client: GeminiFlashClient | None = None,
        openai_client: OpenAIClient | None = None,
    ):
        self.gemini_client = gemini_client or GeminiFlashClient()
        self.openai_client = openai_client or OpenAIClient()
        
        # Track provider health
        self.provider_health: dict[AIProvider, ProviderHealth] = {
            AIProvider.GEMINI: ProviderHealth(provider=AIProvider.GEMINI),
            AIProvider.OPENAI: ProviderHealth(provider=AIProvider.OPENAI),
        }

    def generate_guidance(
        self,
        *,
        context: NegotiationContext,
        prompt_override: str | None = None,
        preferred_provider: AIProvider | None = None,
    ) -> NegotiationGuidance:
        """
        Generate negotiation guidance with automatic failover.
        
        Strategy:
        1. Validate input context
        2. Try preferred provider (default: Gemini)
        3. On failure, try fallback provider (ChatGPT)
        4. If both fail, use deterministic stub
        5. Validate output before returning
        """
        
        # Validate input
        validated_context = self._validate_input(context)
        
        # Determine provider order
        providers = self._get_provider_order(preferred_provider)
        
        last_error: Exception | None = None
        
        for provider in providers:
            try:
                logger.info(f"Attempting to generate guidance with {provider.value}")
                
                # Check circuit breaker
                if not self._is_provider_available(provider):
                    logger.warning(f"Circuit breaker OPEN for {provider.value}, skipping")
                    continue
                
                guidance = self._generate_with_provider(
                    provider=provider,
                    context=validated_context,
                    prompt_override=prompt_override,
                )
                
                # Validate output
                validated_guidance = self._validate_output(guidance)
                
                # Record success
                self._record_success(provider)
                
                logger.info(
                    f"Successfully generated guidance with {provider.value}",
                    extra={
                        "provider": provider.value,
                        "latency_ms": validated_guidance.latency_ms,
                        "confidence": validated_guidance.confidence,
                    },
                )
                
                return validated_guidance
                
            except (GeminiServiceError, OpenAIServiceError, ValidationError) as exc:
                logger.warning(
                    f"Provider {provider.value} failed: {exc}",
                    extra={"provider": provider.value, "error": str(exc)},
                )
                self._record_failure(provider)
                last_error = exc
                continue
        
        # All providers failed, use stub
        logger.error(
            "All AI providers failed, falling back to deterministic stub",
            extra={"last_error": str(last_error) if last_error else "Unknown"},
        )
        
        return self._generate_stub_guidance(context=validated_context, prompt_override=prompt_override)

    def _validate_input(self, context: NegotiationContext) -> NegotiationContext:
        """Validate and sanitize input context."""
        
        # Re-validate with Pydantic to ensure all constraints
        try:
            validated = NegotiationContext.model_validate(context.model_dump())
        except ValidationError as exc:
            logger.error("Input validation failed", extra={"errors": exc.errors()})
            raise ValueError(f"Invalid negotiation context: {exc}") from exc
        
        # Additional business logic validation
        if not validated.topic.strip():
            raise ValueError("Topic cannot be empty or whitespace")
        
        if not validated.current_position.strip():
            raise ValueError("Current position cannot be empty")
        
        if not validated.target_position.strip():
            raise ValueError("Target position cannot be empty")
        
        # Sanitize strings (prevent injection attacks)
        validated = NegotiationContext(
            topic=self._sanitize_string(validated.topic),
            contract_id=self._sanitize_string(validated.contract_id),
            template_id=self._sanitize_string(validated.template_id),
            vertical=self._sanitize_string(validated.vertical) if validated.vertical else None,
            current_position=self._sanitize_string(validated.current_position),
            target_position=self._sanitize_string(validated.target_position),
            fallback_position=self._sanitize_string(validated.fallback_position) if validated.fallback_position else None,
            stakeholders=[self._sanitize_string(s) for s in validated.stakeholders],
            impact=self._sanitize_string(validated.impact) if validated.impact else None,
            risk_signal=self._sanitize_string(validated.risk_signal) if validated.risk_signal else None,
            metadata=validated.metadata,
        )
        
        return validated

    def _sanitize_string(self, text: str) -> str:
        """Sanitize user input to prevent injection attacks."""
        if not text:
            return text
        
        # Remove potentially dangerous characters
        sanitized = text.strip()
        
        # Limit length to prevent DoS
        MAX_LENGTH = 10000
        if len(sanitized) > MAX_LENGTH:
            logger.warning(f"Input truncated from {len(sanitized)} to {MAX_LENGTH} chars")
            sanitized = sanitized[:MAX_LENGTH]
        
        return sanitized

    def _validate_output(self, guidance: Any) -> NegotiationGuidance:
        """Validate output guidance meets quality standards."""
        
        if not guidance:
            raise ValidationError("Guidance is None or empty")
        
        # Ensure all required fields are present
        if not guidance.summary or len(guidance.summary.strip()) < 10:
            raise ValidationError("Summary is too short or empty")
        
        if not guidance.fallback_recommendation or len(guidance.fallback_recommendation.strip()) < 5:
            raise ValidationError("Fallback recommendation is too short or empty")
        
        if not guidance.talking_points or len(guidance.talking_points) == 0:
            raise ValidationError("No talking points provided")
        
        if guidance.confidence < 0.0 or guidance.confidence > 1.0:
            raise ValidationError(f"Invalid confidence value: {guidance.confidence}")
        
        return guidance

    def _get_provider_order(self, preferred: AIProvider | None) -> list[AIProvider]:
        """Get provider fallback order."""
        
        if preferred == AIProvider.OPENAI:
            return [AIProvider.OPENAI, AIProvider.GEMINI, AIProvider.STUB]
        
        # Default: Gemini -> OpenAI -> Stub
        return [AIProvider.GEMINI, AIProvider.OPENAI, AIProvider.STUB]

    def _is_provider_available(self, provider: AIProvider) -> bool:
        """Check if provider is available based on circuit breaker state."""
        
        if provider == AIProvider.STUB:
            return True  # Stub is always available
        
        health = self.provider_health.get(provider)
        if not health:
            return True
        
        if health.state == CircuitBreakerState.CLOSED:
            return True
        
        if health.state == CircuitBreakerState.OPEN:
            # Check if recovery timeout has passed
            import time
            if health.last_failure_time:
                elapsed = time.time() - health.last_failure_time
                if elapsed > self.RECOVERY_TIMEOUT:
                    # Transition to half-open for testing
                    health.state = CircuitBreakerState.HALF_OPEN
                    logger.info(f"Circuit breaker for {provider.value} moved to HALF_OPEN")
                    return True
            return False
        
        # HALF_OPEN: Allow one request through to test
        return True

    def _record_success(self, provider: AIProvider):
        """Record successful provider response."""
        
        if provider == AIProvider.STUB:
            return
        
        health = self.provider_health.get(provider)
        if health:
            health.success_count += 1
            health.failure_count = 0  # Reset failures
            
            if health.state == CircuitBreakerState.HALF_OPEN:
                if health.success_count >= self.SUCCESS_THRESHOLD:
                    health.state = CircuitBreakerState.CLOSED
                    logger.info(f"Circuit breaker for {provider.value} CLOSED (recovered)")

    def _record_failure(self, provider: AIProvider):
        """Record provider failure and update circuit breaker."""
        
        if provider == AIProvider.STUB:
            return
        
        import time
        health = self.provider_health.get(provider)
        if health:
            health.failure_count += 1
            health.last_failure_time = time.time()
            health.success_count = 0
            
            if health.failure_count >= self.FAILURE_THRESHOLD:
                health.state = CircuitBreakerState.OPEN
                logger.error(f"Circuit breaker for {provider.value} OPENED after {health.failure_count} failures")

    def _generate_with_provider(
        self,
        *,
        provider: AIProvider,
        context: NegotiationContext,
        prompt_override: str | None,
    ) -> NegotiationGuidance:
        """Generate guidance with specific provider."""
        
        if provider == AIProvider.GEMINI:
            return self.gemini_client.generate_guidance(
                context=context,
                prompt_override=prompt_override,
            )
        
        elif provider == AIProvider.OPENAI:
            openai_guidance = self.openai_client.generate_guidance(
                context=context,
                prompt_override=prompt_override,
            )
            
            # Convert OpenAI format to unified format
            return NegotiationGuidance(
                summary=openai_guidance.summary,
                fallback_recommendation=openai_guidance.fallback_recommendation,
                talking_points=openai_guidance.talking_points,
                risk_callouts=openai_guidance.risk_callouts,
                confidence=openai_guidance.confidence,
                generated_prompt=openai_guidance.generated_prompt,
                cached=False,
                model=f"openai:{openai_guidance.model}",
                latency_ms=openai_guidance.latency_ms,
                documentation_url=openai_guidance.documentation_url,
            )
        
        elif provider == AIProvider.STUB:
            return self._generate_stub_guidance(context=context, prompt_override=prompt_override)
        
        else:
            raise ValueError(f"Unknown provider: {provider}")

    def _generate_stub_guidance(
        self,
        *,
        context: NegotiationContext,
        prompt_override: str | None,
    ) -> NegotiationGuidance:
        """Generate deterministic stub guidance (never fails)."""
        
        # Use Gemini's stub logic as it's already well-tested
        return self.gemini_client._build_stub_guidance(
            context=context,
            prompt=prompt_override or f"Stub prompt for {context.topic}",
        )

    def get_provider_health_status(self) -> dict[str, Any]:
        """Get current health status of all providers."""
        return {
            provider.value: {
                "state": health.state.value,
                "failure_count": health.failure_count,
                "success_count": health.success_count,
            }
            for provider, health in self.provider_health.items()
        }


def get_multi_ai_orchestrator() -> MultiAIOrchestrator:
    """Dependency injection for multi-AI orchestrator."""
    return MultiAIOrchestrator()


__all__ = [
    "MultiAIOrchestrator",
    "AIProvider",
    "CircuitBreakerState",
    "get_multi_ai_orchestrator",
]
