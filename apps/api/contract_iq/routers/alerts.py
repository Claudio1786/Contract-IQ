from __future__ import annotations

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status

from ..schemas.alerts import AlertSchedulerStatus, AlertTriggerResponse
from ..services.alerts import AlertSchedulerService


router = APIRouter(prefix="/alerts", tags=["alerts"])


def _get_scheduler(request: Request) -> AlertSchedulerService:
    scheduler = getattr(request.app.state, "alert_scheduler", None)
    if scheduler is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="alert scheduler unavailable",
        )
    return scheduler


@router.post("/run", response_model=AlertTriggerResponse)
async def trigger_alert_run(
    scheduler: AlertSchedulerService = Depends(_get_scheduler),
) -> AlertTriggerResponse:
    result = await scheduler.run_cycle()
    return AlertTriggerResponse(
        timestamp=result.timestamp,
        templatesEvaluated=result.templates_evaluated,
        alertsDispatched=result.total_alerts,
        breakdown=result.breakdown,
        channels=scheduler.channels,
        schedulerEnabled=scheduler.config.enabled,
    )


@router.get("/status", response_model=AlertSchedulerStatus)
async def get_alert_status(
    scheduler: AlertSchedulerService = Depends(_get_scheduler),
) -> AlertSchedulerStatus:
    last_result = scheduler.last_result
    timestamp: Optional[datetime] = last_result.timestamp if last_result else None
    alerts = last_result.total_alerts if last_result else 0
    breakdown = last_result.breakdown if last_result else {}

    return AlertSchedulerStatus(
        enabled=scheduler.config.enabled,
        intervalSeconds=scheduler.config.interval_seconds,
        templateIds=list(scheduler.config.template_ids),
        fixturesDir=str(scheduler.config.fixtures_dir),
        channels=scheduler.channels,
        lastRunTimestamp=timestamp,
        lastRunAlerts=alerts,
        lastRunBreakdown=breakdown,
    )
