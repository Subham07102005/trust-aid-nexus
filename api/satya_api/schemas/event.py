from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimelineEntryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    occurred_at: datetime
    label: str
    kind: str
    detail: str | None = None


class EventSummary(BaseModel):
    """Enough for a list or a card. No nested collections."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_type: str
    title: str
    summary: str | None = None
    location_text: str | None = None
    admin_district: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    geo_confidence: float | None = None
    start_time: datetime
    end_time: datetime | None = None
    severity: str
    status: str
    updated_at: datetime
    claim_count: int = 0


class EventDetail(EventSummary):
    """Everything the event page needs, in one request."""
    timeline: list[TimelineEntryOut] = []