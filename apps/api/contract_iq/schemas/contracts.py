from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class ContractPayload(BaseModel):
    metadata: Dict[str, Any]
    financials: Dict[str, Any] | None = None
    clauses: List[Dict[str, Any]] = Field(default_factory=list)
    risks: List[Dict[str, Any]] = Field(default_factory=list)
    obligations: List[Dict[str, Any]] = Field(default_factory=list)
    negotiation: Dict[str, Any] | None = None
    audit: Dict[str, Any] | None = None


class ContractIngestRequest(BaseModel):
    template_id: str = Field(..., description="Identifier matching fixture filename (e.g. saas-msa)")
    team_id: str = Field(..., description="Team identifier triggering the ingest")
    ingest_source: Optional[str] = Field(
        default=None,
        description="Optional hint describing ingestion channel (drive-upload, email-forward, etc.)"
    )


class ContractProcessedResponse(BaseModel):
    contract_id: str
    team_id: str
    processed_at: datetime
    payload: ContractPayload
