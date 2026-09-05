from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..deps import get_db
from ..models import Claim, Event
from ..schemas import EventDetail, EventSummary

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("", response_model=list[EventSummary])
def list_events(
    db: Session = Depends(get_db),
    event_type: str | None = None,
    status: str | None = None,
    district: str | None = None,
    limit: int = Query(50, ge=1, le=200),
):
    # Claim counts in one aggregate query rather than one per event.
    counts = dict(
        db.execute(
            select(Claim.event_id, func.count(Claim.id)).group_by(Claim.event_id)
        ).all()
    )

    stmt = select(Event)
    if event_type:
        stmt = stmt.where(Event.event_type == event_type)
    if status:
        stmt = stmt.where(Event.status == status)
    if district:
        stmt = stmt.where(Event.admin_district == district)
    stmt = stmt.order_by(Event.start_time.desc()).limit(limit)

    out = []
    for event in db.scalars(stmt):
        summary = EventSummary.model_validate(event)
        summary.claim_count = counts.get(event.id, 0)
        out.append(summary)
    return out


@router.get("/{event_id}", response_model=EventDetail)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.scalar(
        select(Event)
        .where(Event.id == event_id)
        .options(selectinload(Event.timeline))
    )
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    detail = EventDetail.model_validate(event)
    detail.claim_count = db.scalar(
        select(func.count(Claim.id)).where(Claim.event_id == event_id)
    )
    return detail