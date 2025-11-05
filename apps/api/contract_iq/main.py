from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import build_api_router


def create_app() -> FastAPI:
    app = FastAPI(title="Contract IQ API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
    )

    @app.get("/health", tags=["health"])  # pragma: no cover - trivial endpoint
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(build_api_router())

    return app


app = create_app()