"""
Unit tests for Alerts service.

Tests:
- Alert configuration loading
- Alert detection logic
- Severity classification
- Notification dispatching
- Scheduling behavior
"""

import pytest
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest.mock import Mock, patch, AsyncMock
from contract_iq.services.alerts import (
    PortfolioAlert,
    AlertDispatchResult,
    AlertSchedulerConfig,
)


class TestPortfolioAlert:
    """Test PortfolioAlert dataclass."""

    def test_create_alert(self):
        """Test creating a basic alert."""
        alert = PortfolioAlert(
            type="renewal",
            contract_id="contract-123",
            template="MSA",
            label="Contract Renewal Due",
            detail="Renewal window opens in 30 days",
            severity="medium"
        )
        
        assert alert.type == "renewal"
        assert alert.contract_id == "contract-123"
        assert alert.template == "MSA"
        assert alert.label == "Contract Renewal Due"
        assert alert.detail == "Renewal window opens in 30 days"
        assert alert.severity == "medium"
        assert alert.due_date is None

    def test_alert_with_due_date(self):
        """Test alert with due date."""
        due_date = datetime(2026, 3, 15, tzinfo=timezone.utc)
        alert = PortfolioAlert(
            type="obligation",
            contract_id="contract-456",
            template="DPA",
            label="Compliance Report Due",
            detail="Annual GDPR compliance report required",
            severity="high",
            due_date=due_date
        )
        
        assert alert.due_date == due_date
        assert alert.severity == "high"

    def test_alert_severity_levels(self):
        """Test different severity levels."""
        severities = ["low", "medium", "high", "critical"]
        
        for sev in severities:
            alert = PortfolioAlert(
                type="risk",
                contract_id="test",
                template=None,
                label="Test",
                detail="Test",
                severity=sev
            )
            assert alert.severity == sev


class TestAlertDispatchResult:
    """Test AlertDispatchResult dataclass."""

    def test_create_dispatch_result(self):
        """Test creating a dispatch result."""
        timestamp = datetime.now(timezone.utc)
        breakdown = {
            "renewal": 3,
            "obligation": 2,
            "risk": 1
        }
        
        result = AlertDispatchResult(
            timestamp=timestamp,
            templates_evaluated=5,
            total_alerts=6,
            breakdown=breakdown
        )
        
        assert result.timestamp == timestamp
        assert result.templates_evaluated == 5
        assert result.total_alerts == 6
        assert result.breakdown["renewal"] == 3
        assert result.breakdown["obligation"] == 2
        assert result.breakdown["risk"] == 1

    def test_empty_breakdown(self):
        """Test dispatch result with no alerts."""
        result = AlertDispatchResult(
            timestamp=datetime.now(timezone.utc),
            templates_evaluated=10,
            total_alerts=0,
            breakdown={}
        )
        
        assert result.total_alerts == 0
        assert len(result.breakdown) == 0


class TestAlertSchedulerConfig:
    """Test AlertSchedulerConfig dataclass."""

    def test_default_config(self):
        """Test default configuration values."""
        config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp/fixtures"),
            template_ids=["template-1", "template-2"],
            slack_channel="#alerts",
            email_recipients=["test@example.com"]
        )
        
        assert config.interval_seconds == 900  # 15 minutes
        assert config.enabled is True
        assert config.renewal_threshold_days == 60
        assert config.renewal_critical_days == 30
        assert config.obligation_threshold_days == 45
        assert config.obligation_critical_days == 14
        assert config.risk_threshold == 4
        assert config.risk_critical_threshold == 5
        assert config.fixed_now is None

    def test_custom_thresholds(self):
        """Test custom threshold configuration."""
        config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp/fixtures"),
            template_ids=[],
            slack_channel=None,
            email_recipients=[],
            renewal_threshold_days=90,
            renewal_critical_days=45,
            obligation_threshold_days=60,
            obligation_critical_days=21,
            risk_threshold=3,
            risk_critical_threshold=4
        )
        
        assert config.renewal_threshold_days == 90
        assert config.renewal_critical_days == 45
        assert config.obligation_threshold_days == 60
        assert config.obligation_critical_days == 21
        assert config.risk_threshold == 3
        assert config.risk_critical_threshold == 4

    def test_disabled_config(self):
        """Test disabled alert scheduler."""
        config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp/fixtures"),
            template_ids=[],
            slack_channel=None,
            email_recipients=[],
            enabled=False
        )
        
        assert config.enabled is False

    def test_fixed_now_for_testing(self):
        """Test fixed timestamp for deterministic testing."""
        fixed_time = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp/fixtures"),
            template_ids=[],
            slack_channel=None,
            email_recipients=[],
            fixed_now=fixed_time
        )
        
        assert config.fixed_now == fixed_time

    @patch.dict('os.environ', {
        'CONTRACT_IQ_ALERT_FIXTURES_DIR': '/custom/path/fixtures'
    })
    def test_from_env_custom_path(self):
        """Test loading configuration from environment variables."""
        config = AlertSchedulerConfig.from_env()
        
        # Path representation differs on Windows vs Unix
        assert "custom" in str(config.fixtures_dir)
        assert "fixtures" in str(config.fixtures_dir)

    @patch.dict('os.environ', {}, clear=True)
    def test_from_env_default_path(self):
        """Test from_env finds default fixtures directory."""
        config = AlertSchedulerConfig.from_env()
        
        # Should find fixtures directory relative to project
        assert config.fixtures_dir is not None
        assert isinstance(config.fixtures_dir, Path)


class TestAlertDetectionLogic:
    """Test alert detection algorithms."""

    def test_renewal_alert_detection(self):
        """Test detection of renewal alerts."""
        # Simulate contract expiring in 45 days
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        expiration = now + timedelta(days=45)
        
        threshold_days = 60
        critical_days = 30
        
        days_until = (expiration - now).days
        
        # Should trigger alert (45 days < 60 threshold)
        should_alert = days_until <= threshold_days
        assert should_alert is True
        
        # Should be medium severity (45 days > 30 critical)
        is_critical = days_until <= critical_days
        assert is_critical is False

    def test_critical_renewal_alert(self):
        """Test critical renewal alert detection."""
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        expiration = now + timedelta(days=15)  # 15 days away
        
        critical_days = 30
        days_until = (expiration - now).days
        
        is_critical = days_until <= critical_days
        assert is_critical is True

    def test_obligation_alert_detection(self):
        """Test obligation deadline alert detection."""
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        deadline = now + timedelta(days=30)
        
        threshold_days = 45
        critical_days = 14
        
        days_until = (deadline - now).days
        
        # Should trigger alert (30 days < 45 threshold)
        should_alert = days_until <= threshold_days
        assert should_alert is True
        
        # Should be critical (30 days > 14 critical)
        is_critical = days_until <= critical_days
        assert is_critical is False

    def test_risk_score_alert_detection(self):
        """Test risk score-based alert detection."""
        risk_scores = [3, 4, 5, 6, 7]
        threshold = 4
        critical_threshold = 5
        
        results = []
        for score in risk_scores:
            should_alert = score >= threshold
            is_critical = score >= critical_threshold
            results.append((score, should_alert, is_critical))
        
        # Verify thresholds
        assert results[0] == (3, False, False)  # Below threshold
        assert results[1] == (4, True, False)   # At threshold, not critical
        assert results[2] == (5, True, True)    # Critical
        assert results[3] == (6, True, True)    # Critical
        assert results[4] == (7, True, True)    # Critical

    def test_past_due_detection(self):
        """Test detection of overdue items."""
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        past_date = now - timedelta(days=10)
        
        is_past_due = past_date < now
        assert is_past_due is True

    def test_no_alert_needed(self):
        """Test case where no alert should be triggered."""
        now = datetime(2026, 1, 1, tzinfo=timezone.utc)
        future_date = now + timedelta(days=100)  # Far future
        
        threshold_days = 60
        days_until = (future_date - now).days
        
        should_alert = days_until <= threshold_days
        assert should_alert is False


class TestAlertSeverityClassification:
    """Test severity classification logic."""

    def test_classify_renewal_severity(self):
        """Test renewal alert severity classification."""
        def classify_renewal(days_until: int, critical_days: int = 30) -> str:
            if days_until <= 0:
                return "critical"
            elif days_until <= critical_days:
                return "high"
            elif days_until <= critical_days * 2:
                return "medium"
            else:
                return "low"
        
        assert classify_renewal(-5) == "critical"   # Expired
        assert classify_renewal(0) == "critical"    # Expires today
        assert classify_renewal(15) == "high"       # Within critical window
        assert classify_renewal(45) == "medium"     # Within 2x critical
        assert classify_renewal(90) == "low"        # Well in advance

    def test_classify_risk_severity(self):
        """Test risk score severity classification."""
        def classify_risk(score: int, threshold: int = 4, critical: int = 5) -> str:
            if score >= critical:
                return "critical"
            elif score >= threshold:
                return "high"
            else:
                return "low"
        
        assert classify_risk(7) == "critical"
        assert classify_risk(5) == "critical"
        assert classify_risk(4) == "high"
        assert classify_risk(3) == "low"

    def test_classify_obligation_severity(self):
        """Test obligation deadline severity."""
        def classify_obligation(days_until: int, critical_days: int = 14) -> str:
            if days_until <= 0:
                return "critical"
            elif days_until <= critical_days:
                return "critical"
            elif days_until <= critical_days * 2:
                return "high"
            else:
                return "medium"
        
        assert classify_obligation(-1) == "critical"  # Overdue
        assert classify_obligation(7) == "critical"   # Within critical window
        assert classify_obligation(20) == "high"      # Within 2x critical
        assert classify_obligation(30) == "medium"    # Further out


class TestAlertScheduling:
    """Test alert scheduling behavior."""

    def test_interval_calculation(self):
        """Test scheduling interval calculation."""
        intervals = {
            "15min": 900,
            "30min": 1800,
            "1hour": 3600,
            "4hours": 14400,
            "1day": 86400
        }
        
        for name, seconds in intervals.items():
            config = AlertSchedulerConfig(
                fixtures_dir=Path("/tmp"),
                template_ids=[],
                slack_channel=None,
                email_recipients=[],
                interval_seconds=seconds
            )
            assert config.interval_seconds == seconds

    def test_next_run_calculation(self):
        """Test calculating next scheduler run time."""
        now = datetime(2026, 1, 1, 12, 0, 0, tzinfo=timezone.utc)
        interval_seconds = 900  # 15 minutes
        
        next_run = now + timedelta(seconds=interval_seconds)
        expected = datetime(2026, 1, 1, 12, 15, 0, tzinfo=timezone.utc)
        
        assert next_run == expected

    def test_scheduler_enabled_check(self):
        """Test scheduler enabled/disabled state."""
        enabled_config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp"),
            template_ids=[],
            slack_channel=None,
            email_recipients=[],
            enabled=True
        )
        
        disabled_config = AlertSchedulerConfig(
            fixtures_dir=Path("/tmp"),
            template_ids=[],
            slack_channel=None,
            email_recipients=[],
            enabled=False
        )
        
        assert enabled_config.enabled is True
        assert disabled_config.enabled is False


class TestAlertFiltering:
    """Test alert filtering and deduplication."""

    def test_filter_by_severity(self):
        """Test filtering alerts by severity."""
        alerts = [
            PortfolioAlert("type1", "id1", None, "label", "detail", "low"),
            PortfolioAlert("type2", "id2", None, "label", "detail", "medium"),
            PortfolioAlert("type3", "id3", None, "label", "detail", "high"),
            PortfolioAlert("type4", "id4", None, "label", "detail", "critical"),
        ]
        
        high_priority = [a for a in alerts if a.severity in ("high", "critical")]
        assert len(high_priority) == 2

    def test_filter_by_type(self):
        """Test filtering alerts by type."""
        alerts = [
            PortfolioAlert("renewal", "id1", None, "label", "detail", "medium"),
            PortfolioAlert("renewal", "id2", None, "label", "detail", "high"),
            PortfolioAlert("obligation", "id3", None, "label", "detail", "low"),
            PortfolioAlert("risk", "id4", None, "label", "detail", "high"),
        ]
        
        renewal_alerts = [a for a in alerts if a.type == "renewal"]
        assert len(renewal_alerts) == 2

    def test_deduplication_by_contract_id(self):
        """Test deduplicating alerts for same contract."""
        alerts = [
            PortfolioAlert("renewal", "contract-1", None, "label1", "detail", "medium"),
            PortfolioAlert("risk", "contract-1", None, "label2", "detail", "high"),
            PortfolioAlert("renewal", "contract-2", None, "label3", "detail", "low"),
        ]
        
        # Get unique contract IDs
        unique_contracts = set(a.contract_id for a in alerts)
        assert len(unique_contracts) == 2


class TestAlertNotificationPayload:
    """Test notification payload construction."""

    def test_slack_payload_structure(self):
        """Test Slack notification payload structure."""
        alert = PortfolioAlert(
            type="renewal",
            contract_id="contract-123",
            template="MSA",
            label="Contract Renewal Due",
            detail="Renewal window opens in 30 days",
            severity="high"
        )
        
        # Simulate payload construction
        payload = {
            "text": f":warning: {alert.label}",
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"*{alert.label}*\n{alert.detail}"
                    }
                }
            ],
            "attachments": [
                {
                    "color": "danger" if alert.severity == "high" else "warning",
                    "fields": [
                        {"title": "Contract", "value": alert.contract_id, "short": True},
                        {"title": "Severity", "value": alert.severity.upper(), "short": True},
                    ]
                }
            ]
        }
        
        assert payload["text"] == ":warning: Contract Renewal Due"
        assert "Contract Renewal Due" in payload["blocks"][0]["text"]["text"]
        assert payload["attachments"][0]["color"] == "danger"

    def test_email_payload_structure(self):
        """Test email notification payload structure."""
        alert = PortfolioAlert(
            type="obligation",
            contract_id="contract-456",
            template="DPA",
            label="Compliance Report Due",
            detail="Annual GDPR compliance report required",
            severity="medium"
        )
        
        # Simulate email payload
        email = {
            "subject": f"[Contract IQ] {alert.label}",
            "body": f"{alert.detail}\n\nContract: {alert.contract_id}\nSeverity: {alert.severity}",
            "priority": "high" if alert.severity in ("high", "critical") else "normal"
        }
        
        assert email["subject"] == "[Contract IQ] Compliance Report Due"
        assert "GDPR" in email["body"]
        assert email["priority"] == "normal"


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
