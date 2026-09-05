"""Shared FastAPI dependencies."""

from collections.abc import Generator

from sqlalchemy.orm import Session

from .db import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """One database session per request, always closed afterwards."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()