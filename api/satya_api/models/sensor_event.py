"""A reading from a physical or virtual environmental sensor."""

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin

SENSOR_TYPES = ("rainfall", "water_level", "soil_moisture", "tilt", "temperature", "other")
QUALITY_FLAGS = ("ok", "suspect", "missing", "calibrating")


class SensorEvent(Base, TimestampMixin):
    __tablename__ = "sensor_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int | None] = mapped_column(
        ForeignKey("events.id", ondelete="SET NULL"), index=True
    )
    source_id: Mapped[int | None] = mapped_column(
        ForeignKey("sources.id", ondelete="SET NULL"), index=True
    )

    sensor_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    sensor_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)

    value: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), nullable=False)
    quality_flag: Mapped[str] = mapped_column(String(20), nullable=False, default="ok")

    observed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    location_text: Mapped[str | None] = mapped_column(String(300))
    admin_district: Mapped[str | None] = mapped_column(String(120), index=True)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    __table_args__ = (
        CheckConstraint(f"sensor_type IN {SENSOR_TYPES}", name="sensor_type_valid"),
        CheckConstraint(f"quality_flag IN {QUALITY_FLAGS}", name="sensor_quality_flag_valid"),
    )

    def __repr__(self) -> str:
        return f"<SensorEvent {self.id} {self.sensor_type}={self.value}{self.unit}>"