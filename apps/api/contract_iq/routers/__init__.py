"""API routers for Contract IQ."""

from fastapi import APIRouter

from .ai import router as ai_router
from .alerts import router as alerts_router
from .contracts import router as contracts_router


def build_api_router() -> APIRouter:
    api_router = APIRouter()
    api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
    api_router.include_router(alerts_router)
    api_router.include_router(ai_router)
    return api_router


__all__ = ["build_api_router"]