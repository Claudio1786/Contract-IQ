"""
Unit tests for Gemini AI service.

Tests:
- Configuration loading
- Prompt generation
- Caching mechanism
- Error handling
- Stub fallback behavior
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from contract_iq.services.gemini import (
    GeminiFlashClient,
    GeminiConfig,
    NegotiationGuidance,
    GeminiServiceError,
)
from contract_iq.schemas.ai import NegotiationContext


class TestGeminiConfig:
    """Test GeminiConfig dataclass and environment loading."""

    def test_default_config(self):
        """Test default configuration values."""
        config = GeminiConfig()
        
        assert config.api_key is None
        assert config.model == "gemini-2.5-flash"
        assert config.temperature == 0.2
        assert config.top_p == 0.9
        assert config.top_k == 40
        assert config.max_output_tokens == 1024
        assert config.enable_cache is True

    def test_custom_config(self):
        """Test custom configuration values."""
        config = GeminiConfig(
            api_key="test-key-123",
            model="gemini-pro",
            temperature=0.5,
            top_p=0.95,
            top_k=50,
            max_output_tokens=2048,
            enable_cache=False,
        )
        
        assert config.api_key == "test-key-123"
        assert config.model == "gemini-pro"
        assert config.temperature == 0.5
        assert config.top_p == 0.95
        assert config.top_k == 50
        assert config.max_output_tokens == 2048
        assert config.enable_cache is False

    @patch.dict('os.environ', {
        'GEMINI_FLASH_API_KEY': 'fake_environment_mock_api_key',
        'GEMINI_FLASH_MODEL': 'gemini-test',
        'GEMINI_FLASH_TEMPERATURE': '0.7',
        'GEMINI_FLASH_TOP_P': '0.8',
        'GEMINI_FLASH_TOP_K': '30',
        'GEMINI_FLASH_MAX_OUTPUT': '512',
        'GEMINI_FLASH_ENABLE_CACHE': 'false',
    })
    def test_from_env(self):
        """Test configuration loading from environment variables."""
        config = GeminiConfig.from_env()
        
        assert config.api_key == 'fake_environment_mock_api_key'
        assert config.model == 'gemini-test'
        assert config.temperature == 0.7
        assert config.top_p == 0.8
        assert config.top_k == 30
        assert config.max_output_tokens == 512
        assert config.enable_cache is False

    @patch.dict('os.environ', {}, clear=True)
    def test_from_env_defaults(self):
        """Test that from_env uses defaults when env vars not set."""
        config = GeminiConfig.from_env()
        
        assert config.api_key is None
        assert config.model == "gemini-2.5-flash"
        assert config.temperature == 0.35  # from_env default
        assert config.enable_cache is True


class TestNegotiationGuidance:
    """Test NegotiationGuidance dataclass."""

    def test_create_guidance(self):
        """Test creating a NegotiationGuidance instance."""
        guidance = NegotiationGuidance(
            summary="Test summary",
            fallback_recommendation="Test fallback",
            talking_points=("Point 1", "Point 2"),
            risk_callouts=("Risk 1",),
            confidence=0.85,
            generated_prompt="Test prompt",
            cached=False,
            model="gemini-2.5-flash",
            latency_ms=150,
            documentation_url="https://example.com/docs"
        )
        
        assert guidance.summary == "Test summary"
        assert guidance.fallback_recommendation == "Test fallback"
        assert len(guidance.talking_points) == 2
        assert len(guidance.risk_callouts) == 1
        assert guidance.confidence == 0.85
        assert guidance.cached is False
        assert guidance.model == "gemini-2.5-flash"
        assert guidance.latency_ms == 150
        assert guidance.documentation_url == "https://example.com/docs"


class TestGeminiFlashClient:
    """Test GeminiFlashClient class."""

    @pytest.fixture
    def mock_context(self):
        """Create a mock NegotiationContext."""
        return NegotiationContext(
            topic="Payment Terms",
            contract_id="contract-001",
            template_id="msa-template",
            current_position="Net 30",
            target_position="Net 60",
            fallback_position="Net 45",
            impact="medium",
            risk_signal="Medium"
        )

    @pytest.fixture
    def client_no_api_key(self):
        """Create a client without API key (stub mode)."""
        config = GeminiConfig(api_key=None, enable_cache=True)
        return GeminiFlashClient(config=config)

    @pytest.fixture
    def client_with_cache(self):
        """Create a client with caching enabled."""
        config = GeminiConfig(api_key="test-key", enable_cache=True)
        return GeminiFlashClient(config=config)

    def test_init_without_api_key(self, client_no_api_key):
        """Test initialization without API key (stub mode)."""
        assert client_no_api_key.config.api_key is None
        assert client_no_api_key._model is None
        assert isinstance(client_no_api_key._cache, dict)

    def test_init_with_custom_cache(self):
        """Test initialization with custom cache."""
        custom_cache = {"key": Mock()}
        config = GeminiConfig(api_key=None)
        client = GeminiFlashClient(config=config, cache=custom_cache)
        
        assert client._cache is custom_cache

    def test_cache_key_generation(self, client_no_api_key, mock_context):
        """Test cache key generation."""
        key1 = client_no_api_key._cache_key(mock_context, None)
        key2 = client_no_api_key._cache_key(mock_context, None)
        
        # Same context should generate same key
        assert key1 == key2
        
        # Different context should generate different key
        different_context = NegotiationContext(
            topic="Different Topic",
            contract_id="contract-002",
            template_id="nda-template",
            current_position="A",
            target_position="B",
            fallback_position="C",
            impact="high"
        )
        key3 = client_no_api_key._cache_key(different_context, None)
        assert key3 != key1

    def test_generate_guidance_stub_mode(self, client_no_api_key, mock_context):
        """Test stub guidance generation when no API key."""
        guidance = client_no_api_key.generate_guidance(context=mock_context)
        
        # Verify stub response structure
        assert isinstance(guidance, NegotiationGuidance)
        assert len(guidance.summary) > 0
        assert len(guidance.talking_points) > 0
        assert len(guidance.risk_callouts) > 0
        assert 0 <= guidance.confidence <= 1
        assert guidance.model == client_no_api_key.config.model  # Returns config model
        assert guidance.cached is False
        assert guidance.latency_ms >= 0

    def test_caching_works(self, client_no_api_key, mock_context):
        """Test that caching works correctly."""
        # First call
        guidance1 = client_no_api_key.generate_guidance(context=mock_context)
        assert guidance1.cached is False
        
        # Second call (should be cached)
        guidance2 = client_no_api_key.generate_guidance(context=mock_context)
        assert guidance2.cached is True
        
        # Content should be the same
        assert guidance1.summary == guidance2.summary
        assert guidance1.talking_points == guidance2.talking_points

    def test_cache_disabled(self, mock_context):
        """Test that caching can be disabled."""
        config = GeminiConfig(api_key=None, enable_cache=False)
        client = GeminiFlashClient(config=config)
        
        # Multiple calls should not use cache
        guidance1 = client.generate_guidance(context=mock_context)
        guidance2 = client.generate_guidance(context=mock_context)
        
        assert guidance1.cached is False
        assert guidance2.cached is False

    @patch('contract_iq.services.gemini.genai.configure')
    @patch('contract_iq.services.gemini.genai.GenerativeModel')
    def test_init_with_api_key_success(self, mock_model_class, mock_configure):
        """Test successful initialization with API key."""
        mock_model = Mock()
        mock_model_class.return_value = mock_model
        
        config = GeminiConfig(api_key="fake_valid_mock_key")
        client = GeminiFlashClient(config=config)
        
        mock_configure.assert_called_once_with(api_key="valid-key")
        mock_model_class.assert_called_once_with("gemini-2.5-flash")
        assert client._model is mock_model


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
