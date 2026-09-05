"""A manipulation indicator detected in a claim. An indicator, not a verdict."""

from sqlalchemy import CheckConstraint, Float, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

# A closed vocabulary. Free-text labels would drift, and comparing signal
# strength across claims requires the same signal to have the same name.
SIGNAL_TYPES = (
    "artificial_urgency",
    "fake_authority",
    "emotional_language",
    "evidence_conflict",
    "context_inconsistency",
    "repeated_wording",
    "missing_attribution",
    "engagement_anomaly",
)


class ManipulationSignal(Base, TimestampMixin):
    __tablename__ = "manipulation_signals"

    id: Mapped[int] = mapped_column(primary_key=True)
    claim_id: Mapped[int] = mapped_column(
        ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True
    )

    signal_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    # 0.0 to 1.0. The prototype uses 0-100; converted on the way in so every
    # score in this schema is on the same scale.
    value: Mapped[float] = mapped_column(Float, nullable=False)
    note: Mapped[str | None] = mapped_column(Text)

    method_version: Mapped[str | None] = mapped_column(String(50))

    claim: Mapped["Claim"] = relationship(back_populates="signals")

    __table_args__ = (
        CheckConstraint(f"signal_type IN {SIGNAL_TYPES}", name="signal_type_valid"),
        CheckConstraint("value BETWEEN 0.0 AND 1.0", name="signal_value_range"),
    )

    def __repr__(self) -> str:
        return f"<ManipulationSignal {self.signal_type}={self.value:.2f}>"