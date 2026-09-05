from datetime import datetime

from pydantic import BaseModel, ConfigDict

from .evidence import EvidenceOut


class ReasonOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    reason_kind: str
    position: int
    generated_by: str | None = None


class SignalOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    signal_type: str
    value: float          # 0.0 - 1.0
    note: str | None = None
    method_version: str | None = None


class RiskOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    information_risk: str
    potential_impact: str
    information_risk_score: float | None = None
    potential_impact_score: float | None = None
    propagation_score: float | None = None
    priority: float | None = None
    formula_version: str
    explanation: str | None = None
    created_at: datetime


class ClaimSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int | None = None
    claim_text: str
    claim_type: str
    disaster_type: str
    location_text: str | None = None
    admin_district: str | None = None
    event_time: datetime | None = None
    time_precision: str

    verification_status: str
    confidence: float | None = None
    confidence_low: float | None = None
    confidence_high: float | None = None

    information_risk: str | None = None
    potential_impact: str | None = None

    last_verified_at: datetime | None = None
    model_version: str | None = None


class ClaimDetail(ClaimSummary):
    reasons: list[ReasonOut] = []
    signals: list[SignalOut] = []
    evidence: list[EvidenceOut] = []
    latest_risk: RiskOut | None = None

    # Evidence rows that support the claim without restating another item.
    # This, not len(evidence), is what corroboration should be judged on.
    independent_support_count: int = 0
    supporting_count: int = 0
    contradicting_count: int = 0