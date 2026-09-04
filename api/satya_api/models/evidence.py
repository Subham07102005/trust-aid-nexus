"""A piece of retrieved evidence bearing on a specific claim."""

from datetime import datetime

from sqlalchemy import (
    CheckConstraint, DateTime, Float, ForeignKey, String, Text, UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

EVIDENCE_TYPES = ("bulletin", "news_article", "sensor_reading", "dataset_record", "social_post", "other")
RELATIONS = ("supports", "contradicts", "partially_supports", "unrelated")


class Evidence(Base, TimestampMixin):
    __tablename__ = "evidence"

    id: Mapped[int] = mapped_column(primary_key=True)
    claim_id: Mapped[int] = mapped_column(
        ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True
    )
    source_id: Mapped[int] = mapped_column(
        ForeignKey("sources.id", ondelete="RESTRICT"), nullable=False, index=True
    )

    evidence_type: Mapped[str] = mapped_column(String(30), nullable=False, default="other")
    title: Mapped[str | None] = mapped_column(String(300))
    content: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(Text)
    content_hash: Mapped[str | None] = mapped_column(String(64), index=True)

    # How this evidence relates to the claim, and how much it counts.
    relation: Mapped[str] = mapped_column(String(30), nullable=False, default="unrelated")
    relevance_score: Mapped[float | None] = mapped_column(Float)
    reliability_score: Mapped[float | None] = mapped_column(Float)
    temporal_match: Mapped[float | None] = mapped_column(Float)
    geographic_match: Mapped[float | None] = mapped_column(Float)

    observed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)
    retrieved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    location_text: Mapped[str | None] = mapped_column(String(300))
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    claim: Mapped["Claim"] = relationship(back_populates="evidence_items")
    source: Mapped["Source"] = relationship()

    __table_args__ = (
        CheckConstraint(f"evidence_type IN {EVIDENCE_TYPES}", name="evidence_type_valid"),
        CheckConstraint(f"relation IN {RELATIONS}", name="evidence_relation_valid"),
        CheckConstraint(
            "relevance_score IS NULL OR (relevance_score BETWEEN 0.0 AND 1.0)",
            name="evidence_relevance_range",
        ),
        CheckConstraint(
            "temporal_match IS NULL OR (temporal_match BETWEEN 0.0 AND 1.0)",
            name="evidence_temporal_range",
        ),
        CheckConstraint(
            "geographic_match IS NULL OR (geographic_match BETWEEN 0.0 AND 1.0)",
            name="evidence_geographic_range",
        ),
        # The same content from the same source cannot attach twice to one claim.
        UniqueConstraint(
            "claim_id", "source_id", "content_hash", name="uq_evidence_claim_source_hash"
        ),
    )

    def __repr__(self) -> str:
        return f"<Evidence {self.id} {self.relation} for claim {self.claim_id}>"