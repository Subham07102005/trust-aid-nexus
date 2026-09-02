"""Quick check that the schema works: insert, query, and reject bad data."""

from datetime import datetime, timezone

from sqlalchemy.exc import IntegrityError

from satya_api.db import SessionLocal
from satya_api.models import Claim, Event, Source

session = SessionLocal()

# --- Insert ---
source = Source(
    name="Assam State Disaster Management Authority",
    source_type="official",
    url="https://asdma.assam.gov.in",
    reliability_tier="very_high",
    reliability_score=0.95,
    rationale="State government authority with statutory disaster mandate.",
)

event = Event(
    event_type="landslide",
    title="Landslide — Dima Hasao",
    location_text="Dima Hasao, Assam",
    admin_district="Dima Hasao",
    latitude=25.1667,
    longitude=93.0167,
    geo_confidence=0.7,
    start_time=datetime(2026, 6, 14, 6, 40, tzinfo=timezone.utc),
    severity="medium",
    status="monitoring",
    summary="Slope instability reported after sustained rainfall.",
)

claim = Claim(
    event=event,
    claim_text="NH-27 is completely blocked because of a landslide.",
    claim_type="road_blockage",
    disaster_type="landslide",
    location_text="NH-27 near Jatinga",
    admin_district="Dima Hasao",
    event_time=datetime(2026, 6, 14, 7, 55, tzinfo=timezone.utc),
    time_precision="hour",
    verification_status="needs_verification",
    confidence=0.61,
    confidence_low=0.44,
    confidence_high=0.78,
    information_risk="high",
    potential_impact="high",
    model_version="none-manual-seed",
)

session.add_all([source, event, claim])
session.commit()
print("Inserted:", source, event, claim, sep="\n  ")

# --- Query ---
found = session.query(Claim).filter(Claim.verification_status == "needs_verification").all()
print(f"\nClaims needing verification: {len(found)}")
print("Linked event:", found[0].event.title)

# --- The constraint must reject an invalid status ---
try:
    session.add(Claim(claim_text="test", verification_status="High Information Risk"))
    session.commit()
    print("\nFAIL — the database accepted an invalid verification status.")
except IntegrityError:
    session.rollback()
    print("\nPASS — invalid verification status rejected by the database.")

session.close()