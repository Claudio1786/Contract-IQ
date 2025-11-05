"""Service layer for Contract IQ."""

from .ingestion import ContractIngestionService, get_ingestion_service

__all__ = ["ContractIngestionService", "get_ingestion_service"]