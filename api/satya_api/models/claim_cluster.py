"""A group of claims that assert substantially the same thing."""

from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, TimestampMixin


class ClaimCluster(Base, TimestampMixin):
    __tablename__ = "claim_clusters"

    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str | None] = mapped_column(String(300))
    summary: Mapped[str | None] = mapped_column(Text)

    representative_claim_id: Mapped[int | None] = mapped_column(
        ForeignKey("claims.id", ondelete="SET NULL")
    )

    size: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # How tightly grouped the members are, from the clustering method.
    cohesion: Mapped[float | None] = mapped_column(Float)
    method_version: Mapped[str | None] = mapped_column(String(50))

    claims: Mapped[list["Claim"]] = relationship(
        back_populates="cluster", foreign_keys="Claim.cluster_id"
    )

    def __repr__(self) -> str:
        return f"<ClaimCluster {self.id} size={self.size} {self.label!r}>"