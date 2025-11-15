"""Service layer for Contract IQ."""

from .alerts import (
    AlertDispatchResult,
    AlertSchedulerConfig,
    AlertSchedulerService,
    EmailNotifier,
    NotificationDispatcher,
    PortfolioAlert,
    SlackNotifier,
)
from .gemini import (
    GeminiConfig,
    GeminiFlashClient,
    GeminiServiceError,
    NegotiationGuidance,
    get_gemini_client,
)
from .ingestion import ContractIngestionService, get_ingestion_service

__all__ = [
    "AlertDispatchResult",
    "AlertSchedulerConfig",
    "AlertSchedulerService",
    "GeminiConfig",
    "GeminiFlashClient",
    "GeminiServiceError",
    "ContractIngestionService",
    "NegotiationGuidance",
    "EmailNotifier",
    "NotificationDispatcher",
    "PortfolioAlert",
    "SlackNotifier",
    "get_ingestion_service",
    "get_gemini_client",
]