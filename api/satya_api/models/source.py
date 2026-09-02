"""Where information comes from, and how much weight it carries."""

from sqlalchemy import CheckConstraint, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin

SOURCE_TYPES = ("official", "news", "social", "sensor", "dataset")
RELIABILITY_TIERS = ("very_high", "high", "medium", "low", "very_low", "unknown")


class Source(Base, TimestampMixin):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    source_type: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    url: Mapped[str | None] = mapped_column(Text)

    reliability_tier: Mapped[str] = mapped_column(
        String(20), nullable=False, default="unknown"
    )
    reliability_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.5)
    # Why this source has the score it has. Required by the spec: reliability
    # values must be justified, not asserted.
    rationale: Mapped[str | None] = mapped_column(Text)

    __table_args__ = (
        CheckConstraint(
            f"source_type IN {SOURCE_TYPES}", name="source_type_valid"
        ),
        CheckConstraint(
            f"reliability_tier IN {RELIABILITY_TIERS}", name="reliability_tier_valid"
        ),
        CheckConstraint(
            "reliability_score >= 0.0 AND reliability_score <= 1.0",
            name="reliability_score_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<Source {self.id} {self.name!r} ({self.reliability_tier})>"