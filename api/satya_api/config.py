"""Application configuration. Values come from environment variables
with development-safe defaults, so nothing secret ever lives in code."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# SQLite for development. Switching to PostgreSQL later means setting
# DATABASE_URL in the environment — no code change.
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{BASE_DIR / 'satya_dev.db'}",
)