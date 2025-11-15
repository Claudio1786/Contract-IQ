from __future__ import annotations

import asyncio
import json
import logging
import os
from contextlib import suppress
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Dict, Iterable, List, Optional, Sequence


DEFAULT_TEMPLATE_IDS: tuple[str, ...] = (
    "saas-msa",
    "saas-dpa",
    "healthcare-baa",
    "public-sector-sow",
    "nil-athlete-agreement",
)


_notifications_logger = logging.getLogger("contract_iq.notifications")
_scheduler_logger = logging.getLogger("contract_iq.alerts")


@dataclass
class PortfolioAlert:
    """Normalized alert representation emitted by the scheduler."""

    type: str
    contract_id: str
    template: Optional[str]
    label: str
    detail: str
    severity: str
    due_date: Optional[datetime] = None


@dataclass
class AlertDispatchResult:
    """Result metadata returned after each scheduler cycle."""

    timestamp: datetime
    templates_evaluated: int
    total_alerts: int
    breakdown: Dict[str, int]


@dataclass
class AlertSchedulerConfig:
    """Configuration for outbound alert scheduling."""

    fixtures_dir: Path
    template_ids: Sequence[str]
    slack_channel: Optional[str]
    email_recipients: Sequence[str]
    interval_seconds: int = 900
    enabled: bool = True
    renewal_threshold_days: int = 60
    renewal_critical_days: int = 30
    obligation_threshold_days: int = 45
    obligation_critical_days: int = 14
    risk_threshold: int = 4
    risk_critical_threshold: int = 5
    fixed_now: Optional[datetime] = None

    @classmethod
    def from_env(cls) -> "AlertSchedulerConfig":
        fixtures_env = os.getenv("CONTRACT_IQ_ALERT_FIXTURES_DIR")
        if fixtures_env:
            fixtures_dir = Path(fixtures_env)
        else:
            # Try to find fixtures directory starting from current file
            current_path = Path(__file__).resolve()
            fixtures_dir = None
            
            # Look up the directory tree for fixtures/contracts
            for parent in current_path.parents:
                potential_dir = parent / "fixtures" / "contracts"
                if potential_dir.exists():
                    fixtures_dir = potential_dir
                    break
            
            # Fallback to a default path if not found
            if fixtures_dir is None:
                fixtures_dir = Path("/app/fixtures/contracts")
                fixtures_dir.mkdir(parents=True, exist_ok=True)

        templates_env = os.getenv("CONTRACT_IQ_ALERT_TEMPLATE_IDS")
        if templates_env:
            template_ids = [value.strip() for value in templates_env.split(",") if value.strip()]
        else:
            template_ids = list(DEFAULT_TEMPLATE_IDS)

        slack_channel = os.getenv("CONTRACT_IQ_ALERT_SLACK_CHANNEL") or "#contract-alerts"

        email_env = os.getenv("CONTRACT_IQ_ALERT_EMAIL_RECIPIENTS", "alerts@example.com")
        email_recipients = [value.strip() for value in email_env.split(",") if value.strip()]

        interval_seconds = _safe_int(os.getenv("CONTRACT_IQ_ALERT_INTERVAL_SECONDS"), default=900)

        enabled = _to_bool(os.getenv("CONTRACT_IQ_ENABLE_ALERT_SCHEDULER", "true"))

        fixed_now_raw = os.getenv("CONTRACT_IQ_ALERT_FIXED_TIME")
        fixed_now = _parse_datetime(fixed_now_raw) if fixed_now_raw else None

        return cls(
            fixtures_dir=fixtures_dir,
            template_ids=template_ids,
            slack_channel=slack_channel,
            email_recipients=email_recipients,
            interval_seconds=interval_seconds,
            enabled=enabled,
            fixed_now=fixed_now,
        )


class NotificationChannel:
    """Protocol-style base class for outbound notification channels."""

    name: str

    async def send(self, alert: PortfolioAlert) -> None:  # pragma: no cover - interface
        raise NotImplementedError


class SlackNotifier(NotificationChannel):
    """Logs Slack-style alert payloads."""

    def __init__(self, channel: str) -> None:
        self._channel = channel
        self.name = "slack"

    async def send(self, alert: PortfolioAlert) -> None:
        message = _format_alert(alert)
        _notifications_logger.info(
            "notification channel=slack destination=%s severity=%s payload=%s",
            self._channel,
            alert.severity,
            message,
        )


class EmailNotifier(NotificationChannel):
    """Logs email-style alert payloads."""

    def __init__(self, recipients: Sequence[str]) -> None:
        self._recipients = list(recipients)
        self.name = "email"

    async def send(self, alert: PortfolioAlert) -> None:
        message = _format_alert(alert)
        _notifications_logger.info(
            "notification channel=email recipients=%s severity=%s payload=%s",
            ",".join(self._recipients),
            alert.severity,
            message,
        )


class NotificationDispatcher:
    """Dispatches alerts to all configured notification channels."""

    def __init__(self, channels: Sequence[NotificationChannel]) -> None:
        self._channels = [channel for channel in channels if channel is not None]

    @property
    def channel_names(self) -> List[str]:
        return [channel.name for channel in self._channels]

    async def dispatch_many(self, alerts: Iterable[PortfolioAlert]) -> None:
        for alert in alerts:
            await self.dispatch(alert)

    async def dispatch(self, alert: PortfolioAlert) -> None:
        for channel in self._channels:
            await channel.send(alert)


class AlertSchedulerService:
    """Coordinates periodic evaluation of portfolio alerts and outbound delivery."""

    def __init__(
        self,
        config: AlertSchedulerConfig,
        dispatcher: NotificationDispatcher,
        clock: Optional[Callable[[], datetime]] = None,
    ) -> None:
        self._config = config
        self._dispatcher = dispatcher
        self._clock = clock or (lambda: datetime.now(timezone.utc))
        self._task: Optional[asyncio.Task[None]] = None
        self._stop_event = asyncio.Event()
        self._last_result: Optional[AlertDispatchResult] = None

    @property
    def config(self) -> AlertSchedulerConfig:
        return self._config

    @property
    def channels(self) -> List[str]:
        return self._dispatcher.channel_names

    async def start(self) -> None:
        if not self._config.enabled:
            _scheduler_logger.info("alert scheduler disabled via config")
            return

        if self._task and not self._task.done():
            return

        self._stop_event = asyncio.Event()
        self._task = asyncio.create_task(self._run_loop(), name="contract-iq-alert-scheduler")
        _scheduler_logger.info(
            "alert scheduler started interval=%s templates=%s",
            self._config.interval_seconds,
            len(self._config.template_ids),
        )

    async def stop(self) -> None:
        if not self._task:
            return

        self._stop_event.set()
        self._task.cancel()
        with suppress(asyncio.CancelledError):
            await self._task
        self._task = None
        _scheduler_logger.info("alert scheduler stopped")

    async def run_cycle(self) -> AlertDispatchResult:
        now = self._clock()
        sources = self._load_sources()
        alerts = _collect_alerts(sources, now, self._config)

        await self._dispatcher.dispatch_many(alerts)

        breakdown: Dict[str, int] = {}
        for alert in alerts:
            breakdown[alert.type] = breakdown.get(alert.type, 0) + 1

        result = AlertDispatchResult(
            timestamp=now,
            templates_evaluated=len(sources),
            total_alerts=len(alerts),
            breakdown=breakdown,
        )

        _scheduler_logger.info(
            "alert cycle completed templates=%s alerts=%s breakdown=%s",
            result.templates_evaluated,
            result.total_alerts,
            json.dumps(result.breakdown, sort_keys=True),
        )

        self._last_result = result
        return result

    async def _run_loop(self) -> None:
        try:
            while not self._stop_event.is_set():
                await self.run_cycle()
                try:
                    await asyncio.wait_for(self._stop_event.wait(), timeout=self._config.interval_seconds)
                except asyncio.TimeoutError:
                    continue
        finally:
            self._task = None

    def _load_sources(self) -> List[Dict[str, object]]:
        sources: List[Dict[str, object]] = []
        for template_id in self._config.template_ids:
            payload = _load_payload(self._config.fixtures_dir, template_id)
            if payload is None:
                continue

            metadata = payload.get("metadata", {})
            template_name = metadata.get("template") if isinstance(metadata, dict) else None

            sources.append(
                {
                    "template_id": template_id,
                    "template_name": template_name if isinstance(template_name, str) else None,
                    "contract_id": f"{template_id}-fixture",
                    "payload": payload,
                }
            )

        return sources

    @property
    def last_result(self) -> Optional[AlertDispatchResult]:
        return self._last_result


def _collect_alerts(
    sources: Sequence[Dict[str, object]],
    now: datetime,
    config: AlertSchedulerConfig,
) -> List[PortfolioAlert]:
    alerts: List[PortfolioAlert] = []
    for source in sources:
        payload = source.get("payload")
        if not isinstance(payload, dict):
            continue

        contract_id = str(source.get("contract_id", "unknown"))
        template_name = source.get("template_name")
        alerts.extend(
            _alerts_for_contract(
                contract_id=contract_id,
                template_name=template_name if isinstance(template_name, str) else None,
                payload=payload,
                now=now,
                config=config,
            )
        )

    alerts.sort(key=_alert_sort_key)
    return alerts


def _alerts_for_contract(
    *,
    contract_id: str,
    template_name: Optional[str],
    payload: Dict[str, object],
    now: datetime,
    config: AlertSchedulerConfig,
) -> List[PortfolioAlert]:
    alerts: List[PortfolioAlert] = []

    metadata = payload.get("metadata")
    metadata_dict = metadata if isinstance(metadata, dict) else {}

    renewal = metadata_dict.get("renewal") if isinstance(metadata_dict, dict) else None
    if isinstance(renewal, dict):
        notice_days = _extract_number(renewal.get("noticeDays"))
        if notice_days is not None and notice_days < config.renewal_threshold_days:
            severity = "critical" if notice_days <= config.renewal_critical_days else "warning"
            alerts.append(
                PortfolioAlert(
                    type="renewal",
                    contract_id=contract_id,
                    template=template_name,
                    label="Renewal notice window",
                    detail=f"Notice window {notice_days} days (< {config.renewal_threshold_days})",
                    severity=severity,
                )
            )

    risks = payload.get("risks")
    if isinstance(risks, list):
        for risk in risks:
            if not isinstance(risk, dict):
                continue

            severity_value = _extract_number(risk.get("severity"))
            if severity_value is None or severity_value < config.risk_threshold:
                continue

            severity = "critical" if severity_value >= config.risk_critical_threshold else "warning"
            signal = str(risk.get("signal") or "Risk alert")
            recommendation = str(risk.get("recommendation") or "Review immediately")
            alerts.append(
                PortfolioAlert(
                    type="risk",
                    contract_id=contract_id,
                    template=template_name,
                    label=signal,
                    detail=f"Severity {severity_value}/5 — {recommendation}",
                    severity=severity,
                )
            )

    obligations = payload.get("obligations")
    if isinstance(obligations, list):
        for obligation in obligations:
            if not isinstance(obligation, dict):
                continue

            due_raw = obligation.get("due")
            due_date = _parse_datetime(due_raw) if isinstance(due_raw, str) else None
            if not due_date:
                continue

            diff_days = _difference_in_days(due_date, now)
            if diff_days > config.obligation_threshold_days:
                continue

            severity = "critical" if diff_days <= config.obligation_critical_days else "warning"
            description = str(obligation.get("description") or "Upcoming obligation")
            if diff_days < 0:
                detail = f"Overdue by {abs(diff_days)} days (was due {due_date.date().isoformat()})"
            elif diff_days == 0:
                detail = "Due today"
            else:
                detail = f"Due in {diff_days} days ({due_date.date().isoformat()})"

            alerts.append(
                PortfolioAlert(
                    type="obligation",
                    contract_id=contract_id,
                    template=template_name,
                    label=description,
                    detail=detail,
                    severity=severity,
                    due_date=due_date,
                )
            )

    return alerts


def _alert_sort_key(alert: PortfolioAlert) -> tuple[int, str, str]:
    return (-_severity_rank(alert.severity), alert.type, alert.contract_id)


def _severity_rank(severity: str) -> int:
    if severity == "critical":
        return 2
    if severity == "warning":
        return 1
    return 0


def _load_payload(fixtures_dir: Path, template_id: str) -> Optional[Dict[str, object]]:
    path = fixtures_dir / f"{template_id}.json"
    if not path.exists():
        _scheduler_logger.warning("alert scheduler missing fixture template_id=%s", template_id)
        return None

    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _extract_number(value: object) -> Optional[int]:
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return int(value)

    if isinstance(value, str) and value.strip():
        try:
            return int(float(value))
        except ValueError:
            return None

    return None


def _parse_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed


def _difference_in_days(target: datetime, base: datetime) -> int:
    delta = target - base
    return int(delta.total_seconds() // 86400)


def _format_alert(alert: PortfolioAlert) -> str:
    base = f"[{alert.type.upper()}] {alert.label} — {alert.detail}"
    template = alert.template or "unknown"
    extras = f"contract={alert.contract_id} template={template}"
    if alert.due_date:
        extras += f" due={alert.due_date.isoformat()}"
    return f"{base} ({extras})"


def _safe_int(value: Optional[str], default: int) -> int:
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


def _to_bool(value: Optional[str]) -> bool:
    if value is None:
        return False
    return value.strip().lower() in {"1", "true", "yes", "on"}
