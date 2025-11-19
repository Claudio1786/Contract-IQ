from __future__ import annotations

import json
import os
import threading
import uuid
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Mapping


@dataclass(frozen=True)
class GuidanceRecord:
    """Persisted negotiation guidance entry."""

    id: str
    contract_id: str
    template_id: str
    topic: str
    guidance: dict[str, Any]
    context: dict[str, Any]
    generated_at: datetime

    def to_payload(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["generated_at"] = self.generated_at.isoformat()
        return payload

    @classmethod
    def from_payload(cls, payload: Mapping[str, Any]) -> "GuidanceRecord":
        generated_at_raw = payload.get("generated_at")
        if isinstance(generated_at_raw, str):
            generated_at = datetime.fromisoformat(generated_at_raw)
        else:
            generated_at = datetime.now(tz=timezone.utc)

        return cls(
            id=str(payload.get("id") or uuid.uuid4()),
            contract_id=str(payload.get("contract_id")),
            template_id=str(payload.get("template_id")),
            topic=str(payload.get("topic")),
            guidance=dict(payload.get("guidance") or {}),
            context=dict(payload.get("context") or {}),
            generated_at=generated_at,
        )


class NegotiationGuidanceRepository:
    """Thread-safe repository for storing negotiation guidance history."""

    def __init__(self, storage_path: Path | None = None) -> None:
        self._storage_path = storage_path
        self._lock = threading.Lock()
        self._records: dict[str, GuidanceRecord] = {}

        if storage_path and storage_path.exists():
            self._load_from_disk()

    def save(
        self,
        *,
        contract_id: str,
        template_id: str,
        topic: str,
        guidance: Mapping[str, Any],
        context: Mapping[str, Any],
    ) -> GuidanceRecord:
        record = GuidanceRecord(
            id=str(uuid.uuid4()),
            contract_id=contract_id,
            template_id=template_id,
            topic=topic,
            guidance=dict(guidance),
            context=dict(context),
            generated_at=datetime.now(tz=timezone.utc),
        )

        with self._lock:
            self._records[record.id] = record
            self._persist_locked()
        return record

    def list_for_contract(self, contract_id: str, *, limit: int = 10) -> list[GuidanceRecord]:
        with self._lock:
            items = [record for record in self._records.values() if record.contract_id == contract_id]

        return sorted(items, key=lambda record: record.generated_at, reverse=True)[:limit]

    def list_recent(self, *, limit: int = 20) -> list[GuidanceRecord]:
        with self._lock:
            items = list(self._records.values())

        return sorted(items, key=lambda record: record.generated_at, reverse=True)[:limit]

    def _persist_locked(self) -> None:
        if not self._storage_path:
            return

        self._storage_path.parent.mkdir(parents=True, exist_ok=True)
        payload = [record.to_payload() for record in self._records.values()]
        self._storage_path.write_text(json.dumps(payload, indent=2, default=str), encoding="utf-8")

    def _load_from_disk(self) -> None:
        if not self._storage_path:
            return
        try:
            data = json.loads(self._storage_path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            return
        except json.JSONDecodeError:
            self._records.clear()
            return

        records = [GuidanceRecord.from_payload(item) for item in data if isinstance(item, dict)]
        self._records = {record.id: record for record in records}


_REPOSITORY: NegotiationGuidanceRepository | None = None


def get_negotiation_repository() -> NegotiationGuidanceRepository:
    """Singleton repository backed by disk storage when available."""

    global _REPOSITORY
    if _REPOSITORY is None:
        data_dir_env = os.getenv("CONTRACT_IQ_DATA_DIR")
        if data_dir_env:
            storage_path = Path(data_dir_env).expanduser().resolve() / "negotiation_history.json"
        else:
            module_root = Path(__file__).resolve().parent.parent
            storage_path = module_root / ".data" / "negotiation_history.json"
        _REPOSITORY = NegotiationGuidanceRepository(storage_path=storage_path)
    return _REPOSITORY


__all__ = [
    "GuidanceRecord",
    "NegotiationGuidanceRepository",
    "get_negotiation_repository",
]