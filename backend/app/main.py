"""Arogya Mitra API — FastAPI application factory with security hardening."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.core.database.engine import create_tables, dispose_engine
from app.core.exceptions import AppError
from app.core.tenant.middleware import BranchScopeMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: create tables (dev). Shutdown: close DB pool."""
    if settings.is_dev:
        await create_tables()
    yield
    await dispose_engine()


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="Enterprise Hospital Management & Public Health Platform API",
    lifespan=lifespan,
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Inject defensive HTTP security headers to protect against XSS, clickjacking, and MIME sniffing."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(self), microphone=(self), geolocation=(self)"
        return response


# --- Middleware Pipeline ---
app.add_middleware(SecurityHeadersMiddleware)

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.add_middleware(BranchScopeMiddleware)


# --- Global Exception Handlers ---
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error_code, "detail": exc.message, "status": exc.status_code},
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    detail = str(exc) if settings.is_dev else "Internal server error occurred. Please contact support."
    return JSONResponse(
        status_code=500,
        content={"error": "INTERNAL_SERVER_ERROR", "detail": detail, "status": 500},
    )


# --- Routers ---
from app.core.auth.router import router as auth_router
from app.modules.admin.router import router as admin_router
from app.modules.patients.router import router as patients_router
from app.modules.referrals.router import router as referrals_router
from app.modules.programs.router import router as programs_router
from app.modules.teleconsult.router import router as teleconsult_router
from app.modules.clinical.router import router as clinical_router
from app.modules.inventory.router import router as inventory_router
from app.modules.sync.router import router as sync_router
from app.modules.abdm.router import router as abdm_router
from app.modules.cdss.router import router as cdss_router
from app.modules.analytics.router import router as analytics_router
from app.modules.lab.router import router as lab_router
from app.modules.emergency.router import router as emergency_router
from app.modules.immunization.router import router as immunization_router

app.include_router(auth_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")
app.include_router(patients_router, prefix="/api/v1")
app.include_router(referrals_router, prefix="/api/v1")
app.include_router(programs_router, prefix="/api/v1")
app.include_router(teleconsult_router, prefix="/api/v1")
app.include_router(clinical_router, prefix="/api/v1")
app.include_router(inventory_router, prefix="/api/v1")
app.include_router(sync_router, prefix="/api/v1")
app.include_router(abdm_router, prefix="/api/v1")
app.include_router(cdss_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(lab_router, prefix="/api/v1")
app.include_router(emergency_router, prefix="/api/v1")
app.include_router(immunization_router, prefix="/api/v1")


@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/api/v1", tags=["Health"])
async def api_root():
    return {"message": "Arogya Mitra API v1", "docs": "/docs"}
