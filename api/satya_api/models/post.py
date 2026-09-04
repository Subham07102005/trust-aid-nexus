"""Raw normalized information collected from a source."""

from datetime import datetime

from sqlalchemy import (
    CheckConstraint, DateTime, Float, ForeignKey, JSON, String, Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

INGESTION_STATUSES = ("pending", "normalized", "processed", "failed", "skipped")


class Post(Base, TimestampMixin):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    source_id: Mapped[int] = mapped_column(
        ForeignKey("sources.id", ondelete="RESTRICT"), nullable=False, index=True
    )
    event_id: Mapped[int | None] = mapped_column(
        ForeignKey("events.id", ondelete="SET NULL"), index=True
    )

    # Identifier used by the originating platform, so we can recognise
    # the same item if it arrives again.
    external_id: Mapped[str | None] = mapped_column(String(200), index=True)

    text: Mapped[str] = mapped_column(Text, nullable=False)
    # SHA-256 of the normalized text. Unique, so the same content cannot
    # enter the database twice — this is what stops duplicate posts from
    # being counted as independent evidence later.
    content_hash: Mapped[str] = mapped_column(
        String(64), nullable=False, unique=True, index=True
    )

    language: Mapped[str | None] = mapped_column(String(10))
    media_reference: Mapped[str | None] = mapped_column(Text)

    # HMAC of the author handle, never the handle itself.
    author_hash: Mapped[str | None] = mapped_column(String(64), index=True)

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), index=True
    )
    ingested_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    location_text: Mapped[str | None] = mapped_column(String(300))
    admin_district: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    geo_confidence: Mapped[float | None] = mapped_column(Float)

    engagement: Mapped[dict | None] = mapped_column(JSON)
    # The original response, kept so re-normalization never needs a re-fetch.
    raw_payload: Mapped[dict | None] = mapped_column(JSON)

    ingestion_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="pending", index=True
    )
    ingestion_error: Mapped[str | None] = mapped_column(Text)

    source: Mapped["Source"] = relationship()
    claims: Mapped[list["Claim"]] = relationship(back_populates="post")

    __table_args__ = (
        CheckConstraint(
            f"ingestion_status IN {INGESTION_STATUSES}", name="post_ingestion_status_valid"
        ),
    )

    def __repr__(self) -> str:
        return f"<Post {self.id} [{self.ingestion_status}] {self.text[:40]!r}>"