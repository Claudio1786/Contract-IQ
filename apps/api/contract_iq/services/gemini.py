from __future__ import annotations

import json
import logging
import os
import re
import time
from dataclasses import dataclass, replace
from hashlib import sha256
from typing import Any, MutableMapping

import google.generativeai as genai
from google.generativeai.types import GenerationConfig

from contract_iq.schemas import NegotiationContext

logger = logging.getLogger("contract_iq.gemini")

DEFAULT_MODEL = "gemini-1.5-flash-latest"


class GeminiServiceError(RuntimeError):
    """Raised when Gemini returns an error or an invalid payload."""


@dataclass(frozen=True)
class GeminiConfig:
    """Configuration parameters for the Gemini Flash client."""

    api_key: str | None = None
    model: str = DEFAULT_MODEL
    temperature: float = 0.35
    top_p: float = 0.95
    top_k: int = 40
    max_output_tokens: int = 768
    enable_cache: bool = True

    @classmethod
    def from_env(cls) -> "GeminiConfig":
        return cls(
            api_key=os.getenv("GEMINI_FLASH_API_KEY"),
            model=os.getenv("GEMINI_FLASH_MODEL", DEFAULT_MODEL),
            temperature=float(os.getenv("GEMINI_FLASH_TEMPERATURE", "0.35")),
            top_p=float(os.getenv("GEMINI_FLASH_TOP_P", "0.95")),
            top_k=int(os.getenv("GEMINI_FLASH_TOP_K", "40")),
            max_output_tokens=int(os.getenv("GEMINI_FLASH_MAX_OUTPUT", "768")),
            enable_cache=os.getenv("GEMINI_FLASH_ENABLE_CACHE", "true").lower() != "false",
        )


@dataclass(frozen=True)
class NegotiationGuidance:
    """Structured negotiation guidance returned from Gemini or stub generation."""

    summary: str
    fallback_recommendation: str
    talking_points: tuple[str, ...]
    risk_callouts: tuple[str, ...]
    confidence: float
    generated_prompt: str
    cached: bool
    model: str
    latency_ms: int
    documentation_url: str | None = None


class GeminiFlashClient:
    """Thin wrapper around the Gemini Flash API with deterministic fallbacks."""

    def __init__(
        self,
        config: GeminiConfig | None = None,
        cache: MutableMapping[str, NegotiationGuidance] | None = None,
    ) -> None:
        self.config = config or GeminiConfig.from_env()
        self._cache: MutableMapping[str, NegotiationGuidance] = cache or {}
        self._model = None

        if self.config.api_key:
            try:
                genai.configure(api_key=self.config.api_key)
                self._model = genai.GenerativeModel(self.config.model)
            except Exception as exc:  # pragma: no cover - defensive logging
                logger.exception("Failed to configure Gemini model", exc_info=exc)
                self._model = None

    def generate_guidance(
        self,
        *,
        context: NegotiationContext,
        prompt_override: str | None = None,
    ) -> NegotiationGuidance:
        cache_key = self._cache_key(context, prompt_override)
        cached_guidance = self._cache.get(cache_key)
        if cached_guidance and self.config.enable_cache:
            logger.debug("Serving Gemini guidance from cache", extra={"topic": context.topic})
            return replace(cached_guidance, cached=True)

        prompt = prompt_override or self._build_prompt(context)

        if not self._model:
            guidance = self._build_stub_guidance(context=context, prompt=prompt)
        else:
            guidance = self._invoke_model(prompt=prompt, context=context)

        if self.config.enable_cache:
            self._cache[cache_key] = replace(guidance, cached=False)

        return guidance

    def _invoke_model(self, *, prompt: str, context: NegotiationContext) -> NegotiationGuidance:
        start = time.perf_counter()
        try:
            response = self._model.generate_content(  # type: ignore[union-attr]
                [prompt],
                generation_config=GenerationConfig(
                    temperature=self.config.temperature,
                    top_p=self.config.top_p,
                    top_k=self.config.top_k,
                    max_output_tokens=self.config.max_output_tokens,
                ),
            )
        except Exception as exc:  # pragma: no cover - network call guard
            logger.exception("Gemini generation failed", exc_info=exc)
            raise GeminiServiceError("Gemini generation failed") from exc

        latency_ms = int((time.perf_counter() - start) * 1000)
        structured = self._extract_structured_payload(response)

        if not structured:
            logger.warning(
                "Gemini response missing structured payload; falling back to deterministic stub",
                extra={"topic": context.topic},
            )
            return self._build_stub_guidance(context=context, prompt=prompt, latency_ms=latency_ms)

        guidance = NegotiationGuidance(
            summary=structured.get("summary", ""),
            fallback_recommendation=structured.get("fallbackRecommendation", ""),
            talking_points=tuple(str(item) for item in structured.get("talkingPoints", [])),
            risk_callouts=tuple(str(item) for item in structured.get("riskCallouts", [])),
            confidence=float(structured.get("confidence", 0.6)),
            generated_prompt=prompt,
            cached=False,
            model=self.config.model,
            latency_ms=latency_ms,
            documentation_url=structured.get("documentationUrl"),
        )

        return guidance

    def _extract_structured_payload(self, response: Any) -> dict[str, Any] | None:
        text: str | None = getattr(response, "text", None)
        if not text:
            return None

        candidate_json = self._parse_json_from_text(text)
        if not candidate_json:
            return None
        if not isinstance(candidate_json, dict):
            return None
        return candidate_json

    @staticmethod
    def _parse_json_from_text(text: str) -> dict[str, Any] | None:
        fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if fenced:
            candidate = fenced.group(1)
        else:
            candidate = text.strip()

        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            return None

    def _build_stub_guidance(
        self,
        *,
        context: NegotiationContext,
        prompt: str,
        latency_ms: int | None = None,
    ) -> NegotiationGuidance:
        fallback = context.fallback_position or context.target_position
        talking_points = (
            f"Reinforce target position: {context.target_position}",
            "Clarify business impact and risk trade-offs",
            "Offer data-backed precedent to support concessions",
        )
        risk_notes: tuple[str, ...]
        if context.risk_signal:
            risk_notes = (
                f"Monitor {context.risk_signal.lower()} risk for {context.topic.lower()}",
                "Escalate to legal if supplier resists fallback",
            )
        else:
            risk_notes = ("Track negotiation outcome for playbook learning",)

        summary = (
            f"Position the conversation around {context.topic.lower()} by contrasting the current "
            f"supplier stance with the desired target outcome. Highlight business impact and align "
            f"stakeholders on the recommended fallback if resistance emerges."
        )

        return NegotiationGuidance(
            summary=summary,
            fallback_recommendation=fallback,
            talking_points=talking_points,
            risk_callouts=risk_notes,
            confidence=0.55,
            generated_prompt=prompt,
            cached=False,
            model=self.config.model,
            latency_ms=latency_ms or 5,
            documentation_url=None,
        )

    def _cache_key(self, context: NegotiationContext, prompt_override: str | None) -> str:
        payload = {
            "context": context.model_dump(mode="json", exclude_none=True),
            "prompt_override": prompt_override,
            "model": self.config.model,
        }
        digest = sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        return digest

    def _build_prompt(self, context: NegotiationContext) -> str:
        metadata = context.metadata.model_dump(exclude_none=True) if context.metadata else {}
        stakeholders = ", ".join(context.stakeholders) if context.stakeholders else "None listed"

        sections = [
            "You are Contract IQ's negotiation co-pilot. Produce a JSON object matching the schema:",
            '{"summary": str, "fallbackRecommendation": str, "talkingPoints": [str], "riskCallouts": [str], "confidence": float, "documentationUrl": str | null}',
            "Context for the negotiation follows:",
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

        sections.append(
            "Return only valid JSON. Confidence must be between 0 and 1. "
            "Keep talkingPoints actionable and concise, favouring no more than 3 items."
        )

        return "\n".join(sections)


def get_gemini_client() -> GeminiFlashClient:
    """FastAPI dependency hook for obtaining a configured Gemini client."""

    return GeminiFlashClient()


__all__ = [
    "GeminiConfig",
    "GeminiFlashClient",
    "GeminiServiceError",
    "NegotiationGuidance",
    "get_gemini_client",
]