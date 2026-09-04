"""Educational / prebunking content shown to users."""

from sqlalchemy import CheckConstraint, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin

INTERVENTION_TYPES = ("prebunk", "explanation", "technique_warning", "quiz")


class Intervention(Base, TimestampMixin):
    __tablename__ = "interventions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    intervention_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)

    body: Mapped[str | None] = mapped_column(Text)
    example: Mapped[str | None] = mapped_column(Text)
    question: Mapped[str | None] = mapped_column(Text)
    # [{"label": "...", "correct": true}, ...]
    options: Mapped[list | None] = mapped_column(JSON)
    answer_explanation: Mapped[str | None] = mapped_column(Text)

    # Which manipulation signal this teaches people to spot.
    target_signal: Mapped[str | None] = mapped_column(String(100), index=True)

    __table_args__ = (
        CheckConstraint(
            f"intervention_type IN {INTERVENTION_TYPES}", name="intervention_type_valid"
        ),
    )

    def __repr__(self) -> str:
        return f"<Intervention {self.id} {self.intervention_type} {self.title!r}>"