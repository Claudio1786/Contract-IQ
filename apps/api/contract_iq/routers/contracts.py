from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..schemas.contracts import ContractIngestRequest, ContractProcessedResponse
from ..services.ingestion import ContractIngestionService, get_ingestion_service


router = APIRouter()


@router.post("/ingest", response_model=ContractProcessedResponse, status_code=status.HTTP_201_CREATED)
async def ingest_contract(
    request: ContractIngestRequest,
    service: ContractIngestionService = Depends(get_ingestion_service)
) -> ContractProcessedResponse:
    try:
        processed = service.process_contract(request)
    except FileNotFoundError as exc:  # pragma: no cover - defensive guard
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return processed