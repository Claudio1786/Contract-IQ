"""API routers for Contract IQ."""

from fastapi import APIRouter

from .contracts import router as contracts_router


def build_api_router() -> APIRouter:
    api_router = APIRouter()
    api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
    return api_router


__all__ = ["build_api_router"]