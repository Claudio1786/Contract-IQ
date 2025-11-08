from __future__ import annotations

from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from contract_iq.main import create_app
from contract_iq.schemas import NegotiationContext
from contract_iq.services.gemini import (
    GeminiConfig,
    GeminiFlashClient,
    NegotiationGuidance,
    get_gemini_client,
)


def test_gemini_client_caches_stub_guidance() -> None:
    context = NegotiationContext(
        topic="Liability Cap",
        contract_id="contract_123",
        template_id="saas-msa",
        current_position="Supplier limits liability to fees paid",
        target_position="Liability capped at 2x fees with carve-outs",
        fallback_position="1x fees with data breach carve-out",
        stakeholders=["Legal", "Finance"],
        risk_signal="High",
    )

    client = GeminiFlashClient(GeminiConfig(api_key=None))

    first = client.generate_guidance(context=context)
    assert first.cached is False
    assert first.summary
    second = client.generate_guidance(context=context)

    assert second.cached is True
    assert second.summary == first.summary
    assert second.fallback_recommendation == first.fallback_recommendation
    assert second.talking_points == first.talking_points


@pytest.mark.asyncio
async def test_negotiation_endpoint_returns_guidance() -> None:
    app = create_app()

    class _FakeGemini:
        def __init__(self) -> None:
            self.calls = 0

        def generate_guidance(
            self,
            *,
            context: NegotiationContext,
            prompt_override: str | None = None,
        ) -> NegotiationGuidance:
            self.calls += 1
            return NegotiationGuidance(
                summary=f"Align on {context.topic} adjustments",
                fallback_recommendation="Offer 60-day notice with mutual termination",
                talking_points=("Reference precedent", "Emphasize customer obligations"),
                risk_callouts=("Escalate if notice exceeds 90 days",),
                confidence=0.82,
                generated_prompt="stub-prompt",
                cached=False,
                model="gemini-1.5-flash",
                latency_ms=128,
                documentation_url="https://example.com/guidance",
            )

    fake_client = _FakeGemini()
    app.dependency_overrides[get_gemini_client] = lambda: fake_client

    transport = ASGITransport(app=app)
    payload: dict[str, Any] = {
        "context": {
            "topic": "Termination for convenience",
            "contract_id": "contract_456",
            "template_id": "saas-msa",
            "vertical": "SaaS",
            "current_position": "120-day notice",
            "target_position": "Mutual 60-day notice",
            "fallback_position": "90-day notice with service credits",
            "stakeholders": ["Legal", "Sales"],
            "impact": "High",
            "risk_signal": "Medium",
            "metadata": {
                "contract_name": "Acme SaaS Agreement",
                "contract_type": "msa",
            },
        }
    }

    try:
        async with AsyncClient(transport=transport, base_url="http://testserver") as client:
            response = await client.post("/ai/negotiation", json=payload)

        assert response.status_code == 200
        body = response.json()

        assert body["summary"].startswith("Align on Termination")
        assert body["fallback_recommendation"] == "Offer 60-day notice with mutual termination"
        assert body["confidence"] == pytest.approx(0.82)
        assert body["cached"] is False
        assert body["model"] == "gemini-1.5-flash"
        assert body["documentation_url"] == "https://example.com/guidance"
        assert fake_client.calls == 1
    finally:
        app.dependency_overrides.pop(get_gemini_client, None)