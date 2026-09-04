"""Raw output from any model, kept for reproducibility. Append-only."""

from sqlalchemy import Float, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin


class ModelPrediction(Base, TimestampMixin):
    __tablename__ = "model_predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    claim_id: Mapped[int | None] = mapped_column(
        ForeignKey("claims.id", ondelete="CASCADE"), index=True
    )
    post_id: Mapped[int | None] = mapped_column(
        ForeignKey("posts.id", ondelete="CASCADE"), index=True
    )

    # e.g. "disaster_classification", "claim_extraction", "verification"
    task: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    model_name: Mapped[str] = mapped_column(String(100), nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    output: Mapped[dict] = mapped_column(JSON, nullable=False)
    confidence: Mapped[float | None] = mapped_column(Float)
    # Hash of the exact input, so a prediction can be traced to what produced it.
    input_hash: Mapped[str | None] = mapped_column(String(64), index=True)
    latency_ms: Mapped[float | None] = mapped_column(Float)

    def __repr__(self) -> str:
        return f"<ModelPrediction {self.id} {self.task}/{self.model_version}>"