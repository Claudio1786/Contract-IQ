from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable
from uuid import uuid4

from ..schemas.contracts import ContractIngestRequest, ContractPayload, ContractProcessedResponse


logger = logging.getLogger("contract_iq.ingestion")


@dataclass
class IngestionConfig:
    fixtures_dir: Path


class ContractIngestionService:
    def __init__(self, config: IngestionConfig) -> None:
        self._config = config

    def process_contract(self, request: ContractIngestRequest) -> ContractProcessedResponse:
        payload_dict = self._load_fixture(request.template_id)
        payload = ContractPayload(**payload_dict)

        processed_at = datetime.now(timezone.utc)
        contract_id = f"contract_{uuid4().hex[:8]}"

        analytics_event = {
            "name": "contract.processed",
            "teamId": request.team_id,
            "timestamp": processed_at.isoformat(),
            "payload": {
                "contractId": contract_id,
                "templateId": request.template_id,
                "ingestSource": request.ingest_source or "manual-fixture",
                "confidence": payload.audit.get("confidence") if payload.audit else None,
            },
        }

        logger.info("analytics_event=%s", json.dumps(analytics_event, sort_keys=True))

        for playbook_event in self._build_playbook_events(
            contract_id=contract_id,
            team_id=request.team_id,
            processed_at=processed_at,
            negotiation=payload.negotiation,
        ):
            logger.info("analytics_event=%s", json.dumps(playbook_event, sort_keys=True))

        return ContractProcessedResponse(
            contract_id=contract_id,
            team_id=request.team_id,
            processed_at=processed_at,
            payload=payload,
        )

    def _load_fixture(self, template_id: str) -> Dict[str, Any]:
        fixture_path = self._config.fixtures_dir / f"{template_id}.json"
        if not fixture_path.exists():
            raise FileNotFoundError(f"Fixture not found for template_id={template_id}")

        with fixture_path.open("r", encoding="utf-8") as handle:
            return json.load(handle)

    @staticmethod
    def _build_playbook_events(
        contract_id: str,
        team_id: str,
        processed_at: datetime,
        negotiation: Dict[str, Any] | None,
    ) -> Iterable[Dict[str, Any]]:
        if not negotiation:
            return []

        topics = negotiation.get("playbook")
        if not isinstance(topics, list):
            return []

        events = []
        for topic in topics:
            if not isinstance(topic, dict) or "topic" not in topic or "target" not in topic:
                continue

            events.append(
                {
                    "name": "playbook.recommended",
                    "teamId": team_id,
                    "timestamp": processed_at.isoformat(),
                    "payload": {
                        "contractId": contract_id,
                        "topic": topic.get("topic"),
                        "target": topic.get("target"),
                        "fallback": topic.get("fallback"),
                        "impact": topic.get("impact", "medium"),
                        "confidence": topic.get("confidence"),
                    },
                }
            )

        return events


def get_ingestion_service() -> ContractIngestionService:
    fixtures_dir = Path(__file__).resolve().parents[4] / "fixtures" / "contracts"
    config = IngestionConfig(fixtures_dir=fixtures_dir)
    return ContractIngestionService(config=config)
