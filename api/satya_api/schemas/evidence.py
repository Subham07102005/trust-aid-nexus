from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EvidenceOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    claim_id: int
    evidence_type: str
    title: str | None = None
    content: str | None = None
    url: str | None = None
    relation: str
    relevance_score: float | None = None
    reliability_score: float | None = None
    temporal_match: float | None = None
    geographic_match: float | None = None
    observed_at: datetime | None = None
    location_text: str | None = None

    source_name: str | None = None
    source_type: str | None = None
    source_reliability_tier: str | None = None

    # Null when this item is an independent observation; otherwise the id of
    # the evidence it restates. Consumers must not count a derived item as
    # separate corroboration.
    derived_from_evidence_id: int | None = None