from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pytest
from httpx import ASGITransport, AsyncClient

from contract_iq.main import create_app
from contract_iq.services.alerts import (
    AlertSchedulerConfig,
    AlertSchedulerService,
    EmailNotifier,
    NotificationDispatcher,
    SlackNotifier,
)


FIXED_NOW = datetime(2025, 11, 5, 12, 0, tzinfo=timezone.utc)


def _fixture_path() -> Path:
    return Path(__file__).resolve().parents[3] / "fixtures" / "contracts"


@pytest.mark.asyncio
async def test_scheduler_cycle_dispatches_expected_alerts(caplog: Any) -> None:
    config = AlertSchedulerConfig(
        fixtures_dir=_fixture_path(),
        template_ids=[
            "saas-msa",
            "saas-dpa",
            "healthcare-baa",
            "public-sector-sow",
            "nil-athlete-agreement",
        ],
        slack_channel="#qa-alerts",
        email_recipients=("alerts@example.com", "product@example.com"),
        interval_seconds=3600,
        enabled=True,
        fixed_now=FIXED_NOW,
    )

    dispatcher = NotificationDispatcher([
        SlackNotifier(config.slack_channel),
        EmailNotifier(config.email_recipients),
    ])

    scheduler = AlertSchedulerService(config=config, dispatcher=dispatcher, clock=lambda: FIXED_NOW)

    caplog.set_level("INFO", logger="contract_iq.notifications")

    result = await scheduler.run_cycle()

    assert result.templates_evaluated == 5
    assert result.total_alerts == 9
    assert result.breakdown == {"renewal": 2, "risk": 5, "obligation": 2}
    assert scheduler.last_result is result

    notification_logs = [record.message for record in caplog.records if "notification" in record.message]
    assert len(notification_logs) == result.total_alerts * 2  # slack + email per alert
    assert any("channel=slack" in message for message in notification_logs)
    assert any("channel=email" in message for message in notification_logs)


@pytest.mark.asyncio
async def test_alert_routes_trigger_and_report(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("CONTRACT_IQ_ENABLE_ALERT_SCHEDULER", "false")
    monkeypatch.setenv("CONTRACT_IQ_ALERT_FIXED_TIME", "2025-11-05T12:00:00+00:00")

    app = create_app()
    transport = ASGITransport(app=app)

    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/alerts/run")
        assert response.status_code == 200

        body = response.json()
        assert body["alertsDispatched"] == 9
        assert body["breakdown"] == {"renewal": 2, "risk": 5, "obligation": 2}
        assert body["schedulerEnabled"] is False

        status_response = await client.get("/alerts/status")
        assert status_response.status_code == 200
        status_body = status_response.json()

        assert status_body["enabled"] is False
        assert status_body["lastRunAlerts"] == 9
        assert status_body["lastRunBreakdown"] == {"renewal": 2, "risk": 5, "obligation": 2}
        assert status_body["channels"]

        health_response = await client.get("/health")
        health = health_response.json()
        assert health["status"] == "ok"
        assert "alerts" in health