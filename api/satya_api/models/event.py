"""A real-world disaster event that claims and posts attach to."""

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

EVENT_TYPES = ("flood", "landslide", "earthquake", "cyclone", "fire", "other")
EVENT_STATUSES = ("developing", "monitoring", "stable", "resolved")
SEVERITIES = ("low", "medium", "high", "critical")


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)

    # Location as written, and location as resolved — deliberately separate.
    location_text: Mapped[str | None] = mapped_column(String(300))
    admin_district: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    geo_confidence: Mapped[float | None] = mapped_column(Float)

    start_time: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    severity: Mapped[str] = mapped_column(String(20), nullable=False, default="low")
    status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="monitoring", index=True
    )

    claims: Mapped[list["Claim"]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    __table_args__ = (
        CheckConstraint(f"event_type IN {EVENT_TYPES}", name="event_type_valid"),
        CheckConstraint(f"status IN {EVENT_STATUSES}", name="event_status_valid"),
        CheckConstraint(f"severity IN {SEVERITIES}", name="event_severity_valid"),
        CheckConstraint(
            "latitude IS NULL OR (latitude BETWEEN -90 AND 90)", name="event_lat_range"
        ),
        CheckConstraint(
            "longitude IS NULL OR (longitude BETWEEN -180 AND 180)",
            name="event_lon_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<Event {self.id} {self.event_type} {self.title!r}>"