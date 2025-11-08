from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class NegotiationMetadata(BaseModel):
    """Supplemental contract attributes that provide AI context."""

    model_config = ConfigDict(extra="allow")

    contract_name: str | None = Field(default=None, max_length=200)
    contract_type: str | None = Field(default=None, max_length=120)
    counterparty: str | None = Field(default=None, max_length=200)
    effective_date: datetime | None = Field(default=None)
    renewal_date: datetime | None = Field(default=None)
    jurisdiction: str | None = Field(default=None, max_length=120)
    additional_context: dict[str, Any] | None = Field(
        default=None,
        description="Arbitrary metadata that may influence guidance generation.",
    )


class NegotiationContext(BaseModel):
    """Key contract positions and signals used to generate negotiation guidance."""

    model_config = ConfigDict(extra="forbid")

    topic: str = Field(..., min_length=1, max_length=160, description="Clause or topic name.")
    contract_id: str = Field(..., min_length=1, description="Unique identifier for the contract.")
    template_id: str = Field(..., min_length=1, description="Template reference powering guidance.")
    vertical: str | None = Field(default=None, max_length=80, description="Industry vertical tag.")
    current_position: str = Field(
        ...,
        min_length=1,
        description="Current clause language or supplier position.",
    )
    target_position: str = Field(
        ...,
        min_length=1,
        description="Preferred or ideal counter-position for the customer.",
    )
    fallback_position: str | None = Field(
        default=None,
        min_length=1,
        description="Minimum acceptable fallback if the target cannot be achieved.",
    )
    stakeholders: list[str] = Field(
        default_factory=list,
        description="Stakeholders who should be informed about the negotiation guidance.",
    )
    impact: str | None = Field(
        default=None,
        max_length=64,
        description="Business impact level for the clause (e.g., High, Medium).",
    )
    risk_signal: str | None = Field(
        default=None,
        max_length=64,
        description="Risk signal classification (e.g., Elevated, Critical).",
    )
    metadata: NegotiationMetadata | None = Field(default=None)

    @field_validator("stakeholders", mode="before")
    @classmethod
    def _normalize_stakeholders(cls, value: Any) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            return [value.strip()] if value.strip() else []
        return [str(item).strip() for item in value if str(item).strip()]


class NegotiationRequest(BaseModel):
    """Request payload for AI-generated negotiation guidance."""

    model_config = ConfigDict(extra="forbid")

    context: NegotiationContext
    prompt_override: str | None = Field(
        default=None,
        min_length=1,
        max_length=4000,
        description="Optional structured prompt that bypasses automated generation.",
    )


class NegotiationGuidanceResponse(BaseModel):
    """AI-generated negotiation guidance returned to the caller."""

    model_config = ConfigDict(extra="forbid")

    summary: str = Field(..., min_length=1, description="High-level negotiation summary.")
    fallback_recommendation: str = Field(
        ...,
        min_length=1,
        description="Recommended fallback if the target position is unattainable.",
    )
    talking_points: list[str] = Field(
        default_factory=list,
        description="Bulletized arguments or talking points to use in the negotiation.",
    )
    risk_callouts: list[str] = Field(
        default_factory=list,
        description="Specific risks to monitor or escalate during negotiations.",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for the generated guidance between 0 and 1.",
    )
    cached: bool = Field(
        default=False,
        description="Flag indicating whether the result was served from an in-memory cache.",
    )
    model: str = Field(..., min_length=1, description="Gemini model identifier used for generation.")
    latency_ms: int = Field(..., ge=0, description="End-to-end latency in milliseconds.")
    documentation_url: str | None = Field(
        default=None,
        description="Optional link to supporting documentation or playbook guidance.",
    )
    generated_prompt: str | None = Field(
        default=None,
        description="Final structured prompt that was supplied to the model.",
    )

    @field_validator("talking_points", "risk_callouts")
    @classmethod
    def _prune_empty_entries(cls, value: list[str]) -> list[str]:
        return [item.strip() for item in value if item and item.strip()]