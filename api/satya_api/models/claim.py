"""An individual factual claim extracted from a post."""

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

DISASTER_TYPES = ("flood", "landslide", "earthquake", "cyclone", "fire", "other", "none")

CLAIM_TYPES = (
    "road_blockage", "flood_level", "water_level", "infrastructure_damage",
    "casualty", "weather", "official_announcement", "evacuation", "other",
)
# Exactly the four values the specification defines. Nothing else.
VERIFICATION_STATUSES = (
    "supported", "contradicted", "needs_verification", "insufficient_evidence",
)

RISK_LEVELS = ("low", "medium", "high", "critical")
TIME_PRECISIONS = ("exact", "hour", "day", "month", "unknown")


class Claim(Base, TimestampMixin):
    __tablename__ = "claims"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int | None] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), index=True
    )
    post_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"), index=True
    )
    cluster_id: Mapped[int | None] = mapped_column(
        ForeignKey("claim_clusters.id", ondelete="SET NULL"), index=True
    )

    claim_text: Mapped[str] = mapped_column(Text, nullable=False)
    claim_type: Mapped[str] = mapped_column(String(40), nullable=False, default="other")
    disaster_type: Mapped[str] = mapped_column(String(30), nullable=False, default="none")

    location_text: Mapped[str | None] = mapped_column(String(300))
    admin_district: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    geo_confidence: Mapped[float | None] = mapped_column(Float)

    # When the claim says the thing happened — not when it was posted.
    event_time: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), index=True
    )
    time_precision: Mapped[str] = mapped_column(
        String(20), nullable=False, default="unknown"
    )

    # --- Truth assessment: separate axis ---
    verification_status: Mapped[str] = mapped_column(
        String(30), nullable=False, default="insufficient_evidence", index=True
    )
    confidence: Mapped[float | None] = mapped_column(Float)
    confidence_low: Mapped[float | None] = mapped_column(Float)
    confidence_high: Mapped[float | None] = mapped_column(Float)

    # --- Danger assessment: a different axis entirely ---
    information_risk: Mapped[str | None] = mapped_column(String(20))
    potential_impact: Mapped[str | None] = mapped_column(String(20))

    model_version: Mapped[str | None] = mapped_column(String(50))

    event: Mapped["Event | None"] = relationship(back_populates="claims")
    post: Mapped["Post | None"] = relationship(back_populates="claims")
    cluster: Mapped["ClaimCluster | None"] = relationship(
        back_populates="claims", foreign_keys=[cluster_id]
    )
    evidence_items: Mapped[list["Evidence"]] = relationship(
        back_populates="claim", cascade="all, delete-orphan"
    )

    __table_args__ = (
        CheckConstraint(f"disaster_type IN {DISASTER_TYPES}", name="claim_disaster_type_valid"),
        CheckConstraint(f"claim_type IN {CLAIM_TYPES}", name="claim_type_valid"),
        CheckConstraint(
            f"verification_status IN {VERIFICATION_STATUSES}",
            name="claim_verification_status_valid",
        ),
        CheckConstraint(f"time_precision IN {TIME_PRECISIONS}", name="claim_time_precision_valid"),
        CheckConstraint(
            f"information_risk IS NULL OR information_risk IN {RISK_LEVELS}",
            name="claim_information_risk_valid",
        ),
        CheckConstraint(
            f"potential_impact IS NULL OR potential_impact IN {RISK_LEVELS}",
            name="claim_potential_impact_valid",
        ),
        CheckConstraint(
            "confidence IS NULL OR (confidence BETWEEN 0.0 AND 1.0)",
            name="claim_confidence_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<Claim {self.id} [{self.verification_status}] {self.claim_text[:50]!r}>"