"""One answer to one resilience test question."""

from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

PHASES = ("pre", "post", "followup")


class TestResult(Base, TimestampMixin):
    __tablename__ = "test_results"

    id: Mapped[int] = mapped_column(primary_key=True)

    # An anonymous per-session token, not a user account.
    participant_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)

    intervention_id: Mapped[int | None] = mapped_column(
        ForeignKey("interventions.id", ondelete="SET NULL"), index=True
    )

    # "pre" before the intervention, "post" after — this is what makes
    # measuring improvement possible.
    phase: Mapped[str] = mapped_column(String(20), nullable=False, default="pre", index=True)

    answer: Mapped[str | None] = mapped_column(String(300))
    is_correct: Mapped[bool | None] = mapped_column(Boolean)
    # What the participant said their confidence was — needed for calibration.
    self_confidence: Mapped[float | None] = mapped_column(Float)
    response_time_ms: Mapped[float | None] = mapped_column(Float)
    answered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    intervention: Mapped["Intervention | None"] = relationship()

    __table_args__ = (
        CheckConstraint(f"phase IN {PHASES}", name="test_result_phase_valid"),
        CheckConstraint(
            "self_confidence IS NULL OR (self_confidence BETWEEN 0.0 AND 1.0)",
            name="test_result_confidence_range",
        ),
    )

    def __repr__(self) -> str:
        return f"<TestResult {self.id} {self.phase} correct={self.is_correct}>"