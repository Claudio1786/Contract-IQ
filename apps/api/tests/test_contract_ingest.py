import json
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from contract_iq.main import app


PORTFOLIO_TEMPLATES = [
    ("saas-msa", "enterprise-saas-msa", 2),
    ("saas-dpa", "saas-data-processing-addendum", 1),
    ("healthcare-baa", "healthcare-business-associate", 2),
    ("public-sector-sow", "public-sector-it-sow", 2),
    ("nil-athlete-agreement", "nil-athlete-endorsement", 1),
]


@pytest.mark.asyncio
async def test_ingest_contract_returns_fixture_payload(caplog: Any) -> None:
    caplog.set_level("INFO", logger="contract_iq.ingestion")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post(
            "/contracts/ingest",
            json={
                "template_id": "saas-msa",
                "team_id": "team_123",
                "ingest_source": "qa-test"
            }
        )

    assert response.status_code == 201
    body = response.json()

    assert body["payload"]["metadata"]["template"] == "enterprise-saas-msa"
    assert body["team_id"] == "team_123"
    assert "contract_id" in body

    analytics_logs = [record.message for record in caplog.records if "analytics_event" in record.message]
    assert analytics_logs, "expected analytics event to be logged"

    parsed_events = [json.loads(message.split("=", maxsplit=1)[-1]) for message in analytics_logs]
    processed_events = [event for event in parsed_events if event["name"] == "contract.processed"]
    playbook_events = [event for event in parsed_events if event["name"] == "playbook.recommended"]

    assert processed_events, "expected contract.processed analytics event"
    assert processed_events[0]["payload"]["templateId"] == "saas-msa"

    assert len(playbook_events) == 2
    topics = {event["payload"]["topic"] for event in playbook_events}
    assert topics == {"Liability Cap", "Renewal Uplift"}
    for event in playbook_events:
        assert event["payload"]["contractId"] == body["contract_id"]


@pytest.mark.asyncio
@pytest.mark.parametrize("template_id, expected_template, expected_playbooks", PORTFOLIO_TEMPLATES)
async def test_ingest_supports_portfolio_templates(
    template_id: str,
    expected_template: str,
    expected_playbooks: int
) -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post(
            "/contracts/ingest",
            json={
                "template_id": template_id,
                "team_id": "demo-team",
                "ingest_source": "fixture-validation"
            }
        )

    assert response.status_code == 201
    payload = response.json()["payload"]

    assert payload["metadata"]["template"] == expected_template

    negotiation = payload.get("negotiation")
    topics = negotiation.get("playbook") if negotiation else []
    assert isinstance(topics, list)
    assert len(topics) == expected_playbooks