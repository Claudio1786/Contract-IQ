from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class AlertTriggerResponse(BaseModel):
    timestamp: datetime
    templatesEvaluated: int
    alertsDispatched: int
    breakdown: Dict[str, int]
    channels: List[str]
    schedulerEnabled: bool


class AlertSchedulerStatus(BaseModel):
    enabled: bool
    intervalSeconds: int
    templateIds: List[str]
    fixturesDir: str
    channels: List[str]
    lastRunTimestamp: Optional[datetime]
    lastRunAlerts: int
    lastRunBreakdown: Dict[str, int]
