"""OpenAI/ChatGPT client for redundancy and failover."""
from __future__ import annotations

import json
import logging
import os
import time
from dataclasses import dataclass
from typing import Any

from contract_iq.schemas import NegotiationContext

logger = logging.getLogger("contract_iq.openai")

DEFAULT_MODEL = "gpt-4o-mini"


class OpenAIServiceError(RuntimeError):
    """Raised when OpenAI returns an error or an invalid payload."""


@dataclass(frozen=True)
class OpenAIConfig:
    """Configuration parameters for the OpenAI client."""

    api_key: str | None = None
    model: str = DEFAULT_MODEL
    temperature: float = 0.2
    max_tokens: int = 1024
    
    @classmethod
    def from_env(cls) -> "OpenAIConfig":
        return cls(
            api_key=os.getenv("OPENAI_API_KEY"),
            model=os.getenv("OPENAI_MODEL", DEFAULT_MODEL),
            temperature=float(os.getenv("OPENAI_TEMPERATURE", "0.35")),
            max_tokens=int(os.getenv("OPENAI_MAX_TOKENS", "768")),
        )


@dataclass(frozen=True)
class OpenAINegotiationGuidance:
    """Structured negotiation guidance returned from OpenAI."""
    
    summary: str
    fallback_recommendation: str
    talking_points: tuple[str, ...]
    risk_callouts: tuple[str, ...]
    confidence: float
    generated_prompt: str
    model: str
    latency_ms: int
    documentation_url: str | None = None


class OpenAIClient:
    """Thin wrapper around OpenAI API for redundancy."""

    def __init__(self, config: OpenAIConfig | None = None) -> None:
        self.config = config or OpenAIConfig.from_env()
        self._client = None

        if self.config.api_key:
            try:
                # Import only if API key is available
                import openai
                self._client = openai.OpenAI(api_key=self.config.api_key)
            except ImportError:
                logger.warning("OpenAI package not installed. Install with: pip install openai")
                self._client = None
            except Exception as exc:
                logger.exception("Failed to configure OpenAI client", exc_info=exc)
                self._client = None

    def generate_guidance(
        self,
        *,
        context: NegotiationContext,
        prompt_override: str | None = None,
    ) -> OpenAINegotiationGuidance:
        """Generate negotiation guidance using ChatGPT."""
        
        if not self._client:
            raise OpenAIServiceError("OpenAI client not available")

        prompt = prompt_override or self._build_prompt(context)

        start = time.perf_counter()
        try:
            response = self._client.chat.completions.create(
                model=self.config.model,
                messages=[
                    {"role": "system", "content": "You are Contract IQ's negotiation co-pilot. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                response_format={"type": "json_object"}
            )
        except Exception as exc:
            logger.exception("OpenAI generation failed", exc_info=exc)
            raise OpenAIServiceError("OpenAI generation failed") from exc

        latency_ms = int((time.perf_counter() - start) * 1000)

        content = response.choices[0].message.content
        if not content:
            raise OpenAIServiceError("Empty response from OpenAI")

        try:
            structured = json.loads(content)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse OpenAI JSON response", extra={"content": content})
            raise OpenAIServiceError("Invalid JSON from OpenAI") from exc

        guidance = OpenAINegotiationGuidance(
            summary=structured.get("summary", ""),
            fallback_recommendation=structured.get("fallbackRecommendation", ""),
            talking_points=tuple(str(item) for item in structured.get("talkingPoints", [])),
            risk_callouts=tuple(str(item) for item in structured.get("riskCallouts", [])),
            confidence=float(structured.get("confidence", 0.6)),
            generated_prompt=prompt,
            model=self.config.model,
            latency_ms=latency_ms,
            documentation_url=structured.get("documentationUrl"),
        )

        return guidance

    def _build_prompt(self, context: NegotiationContext) -> str:
        """Build a structured prompt for OpenAI."""
        metadata = context.metadata.model_dump(exclude_none=True) if context.metadata else {}
        stakeholders = ", ".join(context.stakeholders) if context.stakeholders else "None listed"

        sections = [
            "Produce a JSON object matching this schema:",
            '{"summary": str, "fallbackRecommendation": str, "talkingPoints": [str], "riskCallouts": [str], "confidence": float, "documentationUrl": str | null}',
            "",
            "Context for the negotiation:",
            f"- Topic: {context.topic}",
            f"- Current Position: {context.current_position}",
            f"- Target Position: {context.target_position}",
            f"- Fallback Position: {context.fallback_position or 'None provided'}",
            f"- Stakeholders: {stakeholders}",
            f"- Impact: {context.impact or 'Unspecified'}",
            f"- Risk Signal: {context.risk_signal or 'Not flagged'}",
        ]

        if metadata:
            sections.append(f"- Additional Metadata: {json.dumps(metadata, sort_keys=True)}")

        sections.append("")
        sections.append(
            "Confidence must be between 0 and 1. "
            "Keep talkingPoints actionable and concise (max 3 items). "
            "Return ONLY valid JSON, no markdown."
        )

        return "\n".join(sections)


def get_openai_client() -> OpenAIClient:
    """Dependency injection helper for OpenAI client."""
    return OpenAIClient()


__all__ = [
    "OpenAIConfig",
    "OpenAIClient",
    "OpenAIServiceError",
    "OpenAINegotiationGuidance",
    "get_openai_client",
]
