"""A dated entry in an event's narrative timeline."""

from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

ENTRY_KINDS = ("info", "warn", "alert", "official")


class EventTimelineEntry(Base, TimestampMixin):
    __tablename__ = "event_timeline"

    id: Mapped[int] = mapped_column(primary_key=True)
    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True
    )

    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    label: Mapped[str] = mapped_column(String(300), nullable=False)
    kind: Mapped[str] = mapped_column(String(20), nullable=False, default="info")
    detail: Mapped[str | None] = mapped_column(Text)

    event: Mapped["Event"] = relationship(back_populates="timeline")

    __table_args__ = (
        CheckConstraint(f"kind IN {ENTRY_KINDS}", name="timeline_kind_valid"),
    )

    def __repr__(self) -> str:
        return f"<EventTimelineEntry {self.occurred_at:%H:%M} [{self.kind}] {self.label!r}>"