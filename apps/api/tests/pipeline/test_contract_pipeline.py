"""
Pipeline tests for Contract IQ end-to-end contract flow.

Tests the full journey: fixture load → ingestion → validation → playbook generation
"""
import pytest
from pathlib import Path

from contract_iq.schemas.contracts import ContractIngestRequest, ContractProcessedResponse
from contract_iq.services.ingestion import ContractIngestionService, IngestionConfig


class TestContractPipeline:
    """Test end-to-end contract ingestion and processing pipeline."""

    @pytest.fixture
    def fixtures_dir(self) -> Path:
        """Path to contract fixtures directory."""
        return Path(__file__).resolve().parents[4] / "fixtures" / "contracts"

    @pytest.fixture
    def ingestion_service(self, fixtures_dir: Path) -> ContractIngestionService:
        """Create ingestion service with test fixtures."""
        config = IngestionConfig(fixtures_dir=fixtures_dir)
        return ContractIngestionService(config=config)

    def test_nda_simple_pipeline(self, ingestion_service):
        """Test NDA simple contract pipeline."""
        request = ContractIngestRequest(
            template_id="nda-simple",
            team_id="test-team-001",
            ingest_source="pipeline-test"
        )

        response = ingestion_service.process_contract(request)

        # Validate response structure
        assert response.contract_id is not None
        assert response.contract_id.startswith("contract_")
        assert response.team_id == "test-team-001"
        assert response.processed_at is not None

        # Validate payload
        payload = response.payload
        assert payload.metadata is not None
        assert payload.metadata["template"] == "nda-simple"
        assert payload.metadata["vertical"] == "general"

        # Validate risks
        assert payload.risks is not None
        assert len(payload.risks) > 0
        assert payload.risks[0]["severity"] in ["low", "medium", "high"]

        # Validate obligations
        assert payload.obligations is not None
        assert len(payload.obligations) >= 2

        # Validate negotiation playbook
        assert payload.negotiation is not None
        assert "playbook" in payload.negotiation
        playbook = payload.negotiation["playbook"]
        assert len(playbook) >= 1
        
        # Validate playbook structure
        for topic in playbook:
            assert "topic" in topic
            assert "current" in topic
            assert "target" in topic
            assert "fallback" in topic
            assert "talking_points" in topic
            assert len(topic["talking_points"]) > 0

    def test_msa_standard_pipeline(self, ingestion_service):
        """Test MSA standard contract pipeline."""
        request = ContractIngestRequest(
            template_id="msa-standard",
            team_id="test-team-002",
            ingest_source="pipeline-test"
        )

        response = ingestion_service.process_contract(request)

        # Validate response
        assert response.contract_id is not None
        assert response.team_id == "test-team-002"

        # Validate payload
        payload = response.payload
        assert payload.metadata["template"] == "msa-standard"
        assert payload.metadata["vertical"] == "technology"

        # Validate financials
        assert payload.financials is not None
        assert "baseFee" in payload.financials
        base_fee = payload.financials["baseFee"]
        assert base_fee["amount"] > 0
        assert base_fee["currency"] == "USD"

        # Validate clauses
        assert payload.clauses is not None
        assert len(payload.clauses) >= 4
        
        # Check for liability cap clause
        liability_clauses = [c for c in payload.clauses if "liability" in c.get("id", "").lower()]
        assert len(liability_clauses) > 0

        # Validate risks
        assert len(payload.risks) >= 2

        # Validate negotiation playbook has multiple topics
        playbook = payload.negotiation["playbook"]
        assert len(playbook) >= 3

    def test_dpa_gdpr_pipeline(self, ingestion_service):
        """Test DPA GDPR contract pipeline."""
        request = ContractIngestRequest(
            template_id="dpa-gdpr",
            team_id="test-team-003",
            ingest_source="pipeline-test"
        )

        response = ingestion_service.process_contract(request)

        # Validate response
        payload = response.payload
        assert payload.metadata["template"] == "dpa-gdpr"
        assert payload.metadata["vertical"] == "data-privacy"

        # Validate GDPR-specific clauses
        clause_ids = [c["id"] for c in payload.clauses]
        assert "breach-notification" in clause_ids
        assert "data-subject-rights" in clause_ids

        # Validate high-severity risks
        high_risks = [r for r in payload.risks if r["severity"] == "high"]
        assert len(high_risks) >= 1

        # Validate audit metadata
        audit = payload.audit
        assert audit is not None
        assert audit.get("confidence", 0) >= 0.7
        assert audit.get("reviewRequired") in [True, False]

    def test_sow_consulting_pipeline(self, ingestion_service):
        """Test SOW consulting contract pipeline."""
        request = ContractIngestRequest(
            template_id="sow-consulting",
            team_id="test-team-004",
            ingest_source="pipeline-test"
        )

        response = ingestion_service.process_contract(request)

        # Validate response
        payload = response.payload
        assert payload.metadata["template"] == "sow-consulting"
        assert payload.metadata["vertical"] == "professional-services"

        # Validate financials
        assert payload.financials is not None
        
        # Validate deliverables clause
        deliverable_clauses = [c for c in payload.clauses if "deliverable" in c.get("id", "").lower()]
        assert len(deliverable_clauses) > 0

        # Validate obligations with deadlines
        obligations_with_deadlines = [
            o for o in payload.obligations
            if o.get("deadline") and o["deadline"] != "null"
        ]
        assert len(obligations_with_deadlines) >= 4

    def test_all_existing_fixtures(self, ingestion_service, fixtures_dir):
        """Test all existing fixture files can be processed without errors."""
        fixture_files = [
            "saas-msa.json",
            "healthcare-baa.json",
            "nil-athlete-agreement.json",
            "public-sector-sow.json"
        ]

        for fixture_file in fixture_files:
            if not (fixtures_dir / fixture_file).exists():
                pytest.skip(f"Fixture {fixture_file} not found")
                continue

            template_id = fixture_file.replace(".json", "")
            request = ContractIngestRequest(
                template_id=template_id,
                team_id="test-team-existing",
                ingest_source="pipeline-test-all"
            )

            response = ingestion_service.process_contract(request)

            # Basic validation
            assert response.contract_id is not None
            assert response.payload is not None
            assert response.payload.metadata is not None

    def test_missing_fixture_raises_file_not_found(self, ingestion_service):
        """Test that missing fixture raises FileNotFoundError."""
        request = ContractIngestRequest(
            template_id="nonexistent-template",
            team_id="test-team-error",
            ingest_source="pipeline-test"
        )

        with pytest.raises(FileNotFoundError, match="Fixture not found"):
            ingestion_service.process_contract(request)

    def test_contract_id_uniqueness(self, ingestion_service):
        """Test that each processed contract gets a unique ID."""
        request = ContractIngestRequest(
            template_id="nda-simple",
            team_id="test-team-unique",
            ingest_source="pipeline-test"
        )

        response1 = ingestion_service.process_contract(request)
        response2 = ingestion_service.process_contract(request)

        assert response1.contract_id != response2.contract_id

    def test_analytics_events_structure(self, ingestion_service, caplog):
        """Test that analytics events are logged correctly."""
        request = ContractIngestRequest(
            template_id="msa-standard",
            team_id="test-team-analytics",
            ingest_source="pipeline-test"
        )

        with caplog.at_level("INFO"):
            response = ingestion_service.process_contract(request)

        # Check that analytics events were logged
        analytics_logs = [record for record in caplog.records if "analytics_event" in record.message]
        assert len(analytics_logs) > 0

        # Should have contract.processed event
        contract_processed = [log for log in analytics_logs if "contract.processed" in log.message]
        assert len(contract_processed) == 1

        # Should have playbook.recommended events
        playbook_events = [log for log in analytics_logs if "playbook.recommended" in log.message]
        assert len(playbook_events) >= 1
