from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..deps import get_db
from ..models import Claim, Evidence, RiskAssessment
from ..schemas import ClaimDetail, ClaimSummary, EvidenceOut, RiskOut

router = APIRouter(prefix="/api/claims", tags=["claims"])


def _evidence_out(item: Evidence) -> EvidenceOut:
    out = EvidenceOut.model_validate(item)
    if item.source is not None:
        out.source_name = item.source.name
        out.source_type = item.source.source_type
        out.source_reliability_tier = item.source.reliability_tier
    return out


@router.get("", response_model=list[ClaimSummary])
def list_claims(
    db: Session = Depends(get_db),
    event_id: int | None = None,
    verification_status: str | None = None,
    disaster_type: str | None = None,
    limit: int = Query(50, ge=1, le=200),
):
    stmt = select(Claim)
    if event_id is not None:
        stmt = stmt.where(Claim.event_id == event_id)
    if verification_status:
        stmt = stmt.where(Claim.verification_status == verification_status)
    if disaster_type:
        stmt = stmt.where(Claim.disaster_type == disaster_type)
    stmt = stmt.order_by(Claim.event_time.desc().nullslast()).limit(limit)

    return [ClaimSummary.model_validate(c) for c in db.scalars(stmt)]


@router.get("/{claim_id}", response_model=ClaimDetail)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = db.scalar(
        select(Claim)
        .where(Claim.id == claim_id)
        .options(
            selectinload(Claim.reasons),
            selectinload(Claim.signals),
            selectinload(Claim.evidence_items).selectinload(Evidence.source),
        )
    )
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")

    detail = ClaimDetail.model_validate(claim)
    detail.reasons = list(claim.reasons)
    detail.signals = list(claim.signals)
    detail.evidence = [_evidence_out(e) for e in claim.evidence_items]

    supporting = [e for e in claim.evidence_items if e.relation == "supports"]
    detail.supporting_count = len(supporting)
    detail.contradicting_count = sum(
        1 for e in claim.evidence_items if e.relation == "contradicts"
    )
    # Derived items restate another source rather than observing independently.
    detail.independent_support_count = sum(
        1 for e in supporting if e.derived_from_evidence_id is None
    )

    # Risk assessments are append-only, so the newest row is the current one.
    detail.latest_risk = db.scalar(
        select(RiskAssessment)
        .where(RiskAssessment.claim_id == claim_id)
        .order_by(RiskAssessment.created_at.desc())
        .limit(1)
    )
    return detail