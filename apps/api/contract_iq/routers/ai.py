from __future__ import annotations

import logging
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Query, status

from contract_iq.repositories import GuidanceRecord, NegotiationGuidanceRepository, get_negotiation_repository
from contract_iq.schemas import (
    NegotiationContext,
    NegotiationGuidanceResponse,
    NegotiationHistoryEntry,
    NegotiationHistoryResponse,
    NegotiationRequest,
)
from contract_iq.services.gemini import GeminiFlashClient, GeminiServiceError, get_gemini_client

router = APIRouter(prefix="/ai", tags=["ai"])

logger = logging.getLogger("contract_iq.api.ai")


@router.post("/negotiation", response_model=NegotiationGuidanceResponse)
async def generate_negotiation_guidance(
    payload: NegotiationRequest,
    client: GeminiFlashClient = Depends(get_gemini_client),
    repository: NegotiationGuidanceRepository = Depends(get_negotiation_repository),
) -> NegotiationGuidanceResponse:
    """Generate Gemini-backed negotiation guidance for a clause or topic."""

    try:
        guidance = client.generate_guidance(
            context=payload.context,
            prompt_override=payload.prompt_override,
        )
    except GeminiServiceError as exc:
        logger.exception("Gemini guidance generation failed", extra={"topic": payload.context.topic})
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Gemini service unavailable",
        ) from exc

    logger.info(
        "Generated negotiation guidance",
        extra={
            "topic": payload.context.topic,
            "template_id": payload.context.template_id,
            "cached": guidance.cached,
            "model": guidance.model,
        },
    )

    guidance_payload = {
        "summary": guidance.summary,
        "fallback_recommendation": guidance.fallback_recommendation,
        "talking_points": list(guidance.talking_points),
        "risk_callouts": list(guidance.risk_callouts),
        "confidence": guidance.confidence,
        "cached": guidance.cached,
        "model": guidance.model,
        "latency_ms": guidance.latency_ms,
        "documentation_url": guidance.documentation_url,
        "generated_prompt": guidance.generated_prompt,
    }

    record = None
    try:
        record = repository.save(
            contract_id=payload.context.contract_id,
            template_id=payload.context.template_id,
            topic=payload.context.topic,
            guidance=guidance_payload,
            context=payload.context.model_dump(mode="json", exclude_none=True),
        )
    except Exception:  # pragma: no cover - defensive persistence guard
        logger.exception(
            "Failed to persist negotiation guidance",
            extra={"topic": payload.context.topic, "contract_id": payload.context.contract_id},
        )

    generated_at = record.generated_at if record else datetime.now(tz=timezone.utc)
    guidance_id = record.id if record else str(uuid4())

    return NegotiationGuidanceResponse(
        guidance_id=guidance_id,
        contract_id=payload.context.contract_id,
        template_id=payload.context.template_id,
        topic=payload.context.topic,
        generated_at=generated_at,
        **guidance_payload,
    )


@router.get("/negotiation/history", response_model=NegotiationHistoryResponse)
async def list_negotiation_history(
    *,
    contract_id: str | None = Query(default=None, description="Filter history entries by contract identifier."),
    limit: int = Query(default=10, ge=1, le=100, description="Maximum number of records to return."),
    repository: NegotiationGuidanceRepository = Depends(get_negotiation_repository),
) -> NegotiationHistoryResponse:
    """Return recent negotiation guidance history entries."""

    if contract_id:
        records = repository.list_for_contract(contract_id, limit=limit)
    else:
        records = repository.list_recent(limit=limit)

    return NegotiationHistoryResponse(items=[_record_to_history_entry(record) for record in records])


def _record_to_history_entry(record: GuidanceRecord) -> NegotiationHistoryEntry:
    context = NegotiationContext.model_validate(record.context)
    documentation_raw = record.guidance.get("documentation_url")
    prompt_raw = record.guidance.get("generated_prompt")

    return NegotiationHistoryEntry(
        guidance_id=record.id,
        contract_id=record.contract_id,
        template_id=record.template_id,
        topic=record.topic,
        generated_at=record.generated_at,
        summary=str(record.guidance.get("summary", "")),
        fallback_recommendation=str(record.guidance.get("fallback_recommendation", "")),
        talking_points=[str(item) for item in record.guidance.get("talking_points", [])],
        risk_callouts=[str(item) for item in record.guidance.get("risk_callouts", [])],
        confidence=float(record.guidance.get("confidence", 0.0)),
        cached=bool(record.guidance.get("cached", False)),
        model=str(record.guidance.get("model", "")),
        latency_ms=int(record.guidance.get("latency_ms", 0)),
        documentation_url=str(documentation_raw) if documentation_raw is not None else None,
        generated_prompt=str(prompt_raw) if prompt_raw is not None else None,
        context=context,
    )


__all__ = ["router"]