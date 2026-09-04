"""A risk/impact/priority assessment for a claim. Append-only."""

from sqlalchemy import CheckConstraint, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

RISK_LEVELS = ("low", "medium", "high", "critical")


class RiskAssessment(Base, TimestampMixin):
    __tablename__ = "risk_assessments"

    id: Mapped[int] = mapped_column(primary_key=True)
    claim_id: Mapped[int] = mapped_column(
        ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True
    )

    information_risk: Mapped[str] = mapped_column(String(20), nullable=False)
    information_risk_score: Mapped[float | None] = mapped_column(Float)

    potential_impact: Mapped[str] = mapped_column(String(20), nullable=False)
    potential_impact_score: Mapped[float | None] = mapped_column(Float)

    propagation_score: Mapped[float | None] = mapped_column(Float)
    priority: Mapped[float | None] = mapped_column(Float, index=True)

    # Which version of the formula produced these numbers.
    formula_version: Mapped[str] = mapped_column(String(50), nullable=False)
    explanation: Mapped[str | None] = mapped_column(Text)

    claim: Mapped["Claim"] = relationship()

    __table_args__ = (
        CheckConstraint(f"information_risk IN {RISK_LEVELS}", name="ra_information_risk_valid"),
        CheckConstraint(f"potential_impact IN {RISK_LEVELS}", name="ra_potential_impact_valid"),
    )

    def __repr__(self) -> str:
        return f"<RiskAssessment {self.id} claim={self.claim_id} priority={self.priority}>"