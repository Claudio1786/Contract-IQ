import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import build_api_router
from .services.alerts import (
    AlertSchedulerConfig,
    AlertSchedulerService,
    EmailNotifier,
    NotificationDispatcher,
    SlackNotifier,
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(title="Contract IQ API", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    scheduler_config = AlertSchedulerConfig.from_env()
    channels = []
    if scheduler_config.slack_channel:
        channels.append(SlackNotifier(scheduler_config.slack_channel))
    if scheduler_config.email_recipients:
        channels.append(EmailNotifier(scheduler_config.email_recipients))

    dispatcher = NotificationDispatcher(channels)
    clock = (lambda: scheduler_config.fixed_now) if scheduler_config.fixed_now else None
    scheduler = AlertSchedulerService(
        config=scheduler_config,
        dispatcher=dispatcher,
        clock=clock,
    )

    app.state.alert_scheduler = scheduler

    @app.on_event("startup")
    async def _startup() -> None:
        port = os.environ.get('PORT', 'unknown')
        logger.info(f"🚀 Contract IQ API starting up on port {port}")
        logger.info(f"🔑 Gemini API key configured: {'Yes' if os.environ.get('GEMINI_FLASH_API_KEY') else 'No'}")
        logger.info(f"🗄️ Database configured: {'Yes' if os.environ.get('DATABASE_URL') else 'No'}")
        await scheduler.start()
        logger.info("✅ Contract IQ API startup complete - ready for requests!")

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        await scheduler.stop()

    @app.get("/", tags=["root"])
    async def root() -> dict[str, str]:
        return {
            "message": "Contract IQ API is running! 🚀", 
            "docs": "/docs",
            "health": "/health"
        }
    
    @app.get("/health", tags=["health"])  # pragma: no cover - trivial endpoint
    async def health() -> dict[str, object]:
        response: dict[str, object] = {
            "status": "ok",
            "service": "Contract IQ API",
            "port": os.environ.get('PORT', 'unknown'),
            "database": "connected" if os.environ.get('DATABASE_URL') else "not configured",
            "gemini": "configured" if os.environ.get('GEMINI_FLASH_API_KEY') else "not configured"
        }
        if scheduler.last_result:
            response["alerts"] = {
                "templates": scheduler.last_result.templates_evaluated,
                "dispatched": scheduler.last_result.total_alerts,
            }
        return response

    app.include_router(build_api_router())

    return app


app = create_app()