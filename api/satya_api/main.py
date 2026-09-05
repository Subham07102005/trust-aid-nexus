"""SATYA IMMUNE X — API service."""

import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from .deps import get_db
from .models import Claim, Event
from .routers import claims, events, evidence

app = FastAPI(
    title="SATYA IMMUNE X API",
    description=(
        "Disaster information intelligence — research prototype. "
        "Assessments are system-generated and are not official emergency "
        "instructions."
    ),
    version="0.1.0",
)

# The frontend runs on a different origin during development.
# Override with a comma-separated CORS_ORIGINS environment variable.
origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(events.router)
app.include_router(claims.router)
app.include_router(evidence.router)


@app.get("/healthz", tags=["meta"])
def healthz(db: Session = Depends(get_db)):
    """Liveness plus a real database round trip."""
    events_count = db.scalar(select(func.count(Event.id)))
    claims_count = db.scalar(select(func.count(Claim.id)))
    return {
        "status": "ok",
        "database": "reachable",
        "events": events_count,
        "claims": claims_count,
    }