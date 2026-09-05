from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from ..deps import get_db
from ..models import Evidence
from ..schemas import EvidenceOut
from .claims import _evidence_out

router = APIRouter(prefix="/api/evidence", tags=["evidence"])


@router.get("/{claim_id}", response_model=list[EvidenceOut])
def evidence_for_claim(claim_id: int, db: Session = Depends(get_db)):
    items = db.scalars(
        select(Evidence)
        .where(Evidence.claim_id == claim_id)
        .options(selectinload(Evidence.source))
        .order_by(Evidence.observed_at)
    )
    return [_evidence_out(e) for e in items]