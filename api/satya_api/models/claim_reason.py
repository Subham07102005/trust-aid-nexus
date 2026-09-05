"""One line of the explanation shown for a claim assessment."""

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin

# What kind of consideration this reason expresses. Recording it means the
# explanation panel can group reasons, and error analysis at Step 21 can ask
# which category of reasoning fails most often.
REASON_KINDS = (
    "evidence_support", "evidence_absence", "evidence_conflict",
    "source_reliability", "temporal", "geographic", "linguistic",
    "propagation", "other",
)


class ClaimReason(Base, TimestampMixin):
    __tablename__ = "claim_reasons"

    id: Mapped[int] = mapped_column(primary_key=True)
    claim_id: Mapped[int] = mapped_column(
        ForeignKey("claims.id", ondelete="CASCADE"), nullable=False, index=True
    )

    text: Mapped[str] = mapped_column(Text, nullable=False)
    reason_kind: Mapped[str] = mapped_column(String(30), nullable=False, default="other")
    # Display order. Reasons are shown as an ordered list, and row order in a
    # relational table is not guaranteed.
    position: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Which component produced this line — never an unattributed sentence.
    generated_by: Mapped[str | None] = mapped_column(String(50))

    claim: Mapped["Claim"] = relationship(back_populates="reasons")

    __table_args__ = (
        CheckConstraint(f"reason_kind IN {REASON_KINDS}", name="claim_reason_kind_valid"),
    )

    def __repr__(self) -> str:
        return f"<ClaimReason {self.id} [{self.reason_kind}] {self.text[:40]!r}>"