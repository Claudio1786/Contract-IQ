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
        await scheduler.start()

    @app.on_event("shutdown")
    async def _shutdown() -> None:
        await scheduler.stop()

    @app.get("/health", tags=["health"])  # pragma: no cover - trivial endpoint
    async def health() -> dict[str, object]:
        response: dict[str, object] = {"status": "ok"}
        if scheduler.last_result:
            response["alerts"] = {
                "templates": scheduler.last_result.templates_evaluated,
                "dispatched": scheduler.last_result.total_alerts,
            }
        return response

    app.include_router(build_api_router())

    return app


app = create_app()