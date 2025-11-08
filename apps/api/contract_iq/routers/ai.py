from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from contract_iq.schemas import NegotiationGuidanceResponse, NegotiationRequest
from contract_iq.services.gemini import GeminiFlashClient, GeminiServiceError, get_gemini_client

router = APIRouter(prefix="/ai", tags=["ai"])

logger = logging.getLogger("contract_iq.api.ai")


@router.post("/negotiation", response_model=NegotiationGuidanceResponse)
async def generate_negotiation_guidance(
    payload: NegotiationRequest,
    client: GeminiFlashClient = Depends(get_gemini_client),
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

    return NegotiationGuidanceResponse(
        summary=guidance.summary,
        fallback_recommendation=guidance.fallback_recommendation,
        talking_points=list(guidance.talking_points),
        risk_callouts=list(guidance.risk_callouts),
        confidence=guidance.confidence,
        cached=guidance.cached,
        model=guidance.model,
        latency_ms=guidance.latency_ms,
        documentation_url=guidance.documentation_url,
        generated_prompt=guidance.generated_prompt,
    )


__all__ = ["router"]