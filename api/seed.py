"""Load prototype demo data into the database as real rows.

Data is transcribed from src/lib/mock-data.ts. Nothing here is invented —
that is what makes this a valid test of the schema.

Safe to re-run: it clears the tables it populates first.

NOTE: the c-202 block below is transcribed exactly from mock-data.ts.
The c-201, c-203 and c-204 blocks are approximations — open mock-data.ts
and correct them against the real values before relying on this data.
"""

from datetime import datetime, timezone

from satya_api.db import SessionLocal
from satya_api.models import (
    Claim, Event, Evidence, Intervention, Post, RiskAssessment, Source,
)


def utc(y, m, d, hh=0, mm=0):
    return datetime(y, m, d, hh, mm, tzinfo=timezone.utc)


session = SessionLocal()

# Clear in dependency order (children before parents).
for model in (Evidence, RiskAssessment, Claim, Post, Event, Intervention, Source):
    session.query(model).delete()
session.commit()

# ---------------------------------------------------------------- sources ---

asdma = Source(
    name="Assam State Disaster Management Authority",
    source_type="official",
    url="https://asdma.assam.gov.in",
    reliability_tier="very_high",
    reliability_score=0.95,
    rationale="State government authority with statutory disaster mandate.",
)
wrd = Source(
    name="Water Resources Department, Assam",
    source_type="official",
    reliability_tier="very_high",
    reliability_score=0.92,
    rationale="State department responsible for gauge readings and embankment monitoring.",
)
cwc = Source(
    name="Central Water Commission",
    source_type="official",
    url="https://cwc.gov.in",
    reliability_tier="very_high",
    reliability_score=0.93,
    rationale="National authority for river water level monitoring.",
)
regional_news = Source(
    name="Regional news outlet (demo)",
    source_type="news",
    reliability_tier="medium",
    reliability_score=0.6,
    rationale="Established outlet; single-source reports are not independently corroborated.",
)
social = Source(
    name="Unverified social account (demo)",
    source_type="social",
    reliability_tier="low",
    reliability_score=0.2,
    rationale="Unverified account with no attribution or institutional accountability.",
)
session.add_all([asdma, wrd, cwc, regional_news, social])
session.flush()

# ----------------------------------------------------------------- events ---

dibrugarh = Event(
    event_type="flood",
    title="Flood — Assam",
    location_text="Dibrugarh, Assam",
    admin_district="Dibrugarh",
    latitude=27.4728, longitude=94.9120, geo_confidence=0.8,
    start_time=utc(2026, 6, 14, 8, 0),
    severity="high", status="developing",
    summary=(
        "Rising water levels reported across several wards. Information volume is "
        "increasing faster than official confirmations."
    ),
)
dima_hasao = Event(
    event_type="landslide",
    title="Landslide — Dima Hasao",
    location_text="Dima Hasao, Assam",
    admin_district="Dima Hasao",
    latitude=25.1667, longitude=93.0167, geo_confidence=0.7,
    start_time=utc(2026, 6, 14, 6, 40),
    severity="medium", status="monitoring",
    summary="Slope instability reported after sustained rainfall.",
)
barpeta = Event(
    event_type="flood",
    title="Flood — Barpeta",
    location_text="Barpeta, Assam",
    admin_district="Barpeta",
    latitude=26.3225, longitude=91.0060, geo_confidence=0.8,
    start_time=utc(2026, 6, 13, 18, 0),
    severity="low", status="stable",
    summary="Water levels receding; monitoring continues.",
)
session.add_all([dibrugarh, dima_hasao, barpeta])
session.flush()

# ----------------------------------------------------------------- claims ---

# c-201 — prototype status was "High Information Risk", which is a risk level,
# not a verification outcome. It splits across three columns here.
c201 = Claim(
    event=dibrugarh,
    claim_text="All residents of Dibrugarh have been ordered to evacuate immediately.",
    claim_type="evacuation",
    disaster_type="flood",
    location_text="Dibrugarh",
    admin_district="Dibrugarh",
    event_time=utc(2026, 6, 14, 8, 30),
    time_precision="hour",
    verification_status="needs_verification",
    confidence=0.35, confidence_low=0.20, confidence_high=0.52,
    information_risk="critical",
    potential_impact="critical",
    model_version="seed-manual-v1",
)

# c-202 — transcribed exactly from mock-data.ts.
c202 = Claim(
    event=dibrugarh,
    claim_text="Water level at the Dibrugarh embankment crossed the danger mark this morning.",
    claim_type="water_level",
    disaster_type="flood",
    location_text="Dibrugarh, Assam",
    admin_district="Dibrugarh",
    # "this morning" is a day-level expression, not an exact hour.
    event_time=utc(2026, 6, 14, 9, 0),
    time_precision="day",
    verification_status="supported",
    confidence=0.91, confidence_low=0.84, confidence_high=0.96,
    information_risk="low",
    potential_impact="medium",
    model_version="seed-manual-v1",
)

c203 = Claim(
    event=dima_hasao,
    claim_text="NH-27 is completely blocked because of a landslide.",
    claim_type="road_blockage",
    disaster_type="landslide",
    location_text="NH-27 near Jatinga",
    admin_district="Dima Hasao",
    event_time=utc(2026, 6, 14, 7, 55),
    time_precision="hour",
    verification_status="needs_verification",
    confidence=0.61, confidence_low=0.44, confidence_high=0.78,
    information_risk="high",
    potential_impact="high",
    model_version="seed-manual-v1",
)

c204 = Claim(
    event=barpeta,
    claim_text="This photograph shows Barpeta town under water today.",
    claim_type="flood_level",
    disaster_type="flood",
    location_text="Barpeta",
    admin_district="Barpeta",
    event_time=utc(2026, 6, 14, 9, 0),
    time_precision="day",
    verification_status="contradicted",
    confidence=0.82, confidence_low=0.71, confidence_high=0.90,
    information_risk="medium",
    potential_impact="medium",
    model_version="seed-manual-v1",
)

session.add_all([c201, c202, c203, c204])
session.flush()

# --------------------------------------------------------------- evidence ---

session.add_all([
    # --- c-202: transcribed from mock-data.ts ---
    Evidence(
        claim=c202, source=wrd,
        evidence_type="bulletin",
        title="Water resources department reading",
        content="Gauge reading published at 09:00.",
        relation="supports",
        relevance_score=0.92, reliability_score=0.92,
        temporal_match=0.95, geographic_match=0.95,
        observed_at=utc(2026, 6, 14, 9, 0),
        retrieved_at=utc(2026, 6, 14, 9, 30),
        location_text="Dibrugarh",
    ),
    Evidence(
        claim=c202, source=regional_news,
        evidence_type="news_article",
        title="Local newspaper report",
        content="Cites the same departmental reading.",
        # NOTE: this report restates the gauge reading above rather than
        # observing anything independently. The schema cannot yet express
        # that dependency, so a fusion step would currently double-count it.
        relation="supports",
        relevance_score=0.70, reliability_score=0.60,
        temporal_match=0.90, geographic_match=0.90,
        observed_at=utc(2026, 6, 14, 9, 40),
        retrieved_at=utc(2026, 6, 14, 10, 0),
        location_text="Dibrugarh",
    ),

    # --- c-203 / c-204: approximate. Correct these from mock-data.ts. ---
    Evidence(
        claim=c203, source=asdma,
        evidence_type="bulletin",
        title="District bulletin — road status",
        content="Partial obstruction reported; clearance work underway.",
        relation="partially_supports",
        relevance_score=0.82, reliability_score=0.95,
        temporal_match=0.90, geographic_match=0.85,
        observed_at=utc(2026, 6, 14, 8, 10),
        retrieved_at=utc(2026, 6, 14, 8, 30),
        location_text="Dima Hasao district",
    ),
    Evidence(
        claim=c204, source=cwc,
        evidence_type="dataset_record",
        title="Water level observation — Barpeta",
        content="Levels below warning threshold at the reference gauge.",
        relation="contradicts",
        relevance_score=0.88, reliability_score=0.93,
        temporal_match=0.95, geographic_match=0.90,
        observed_at=utc(2026, 6, 14, 7, 0),
        retrieved_at=utc(2026, 6, 14, 9, 15),
        location_text="Barpeta",
    ),
])

# -------------------------------------------------------- risk assessments ---
# Priority values come from the prototype's display, not from any model.
# formula_version records that explicitly so they cannot later be mistaken
# for computed output.

session.add_all([
    RiskAssessment(
        claim=c201, information_risk="critical", potential_impact="critical",
        information_risk_score=0.88, potential_impact_score=0.96,
        propagation_score=0.79, priority=96.0,
        formula_version="seed-placeholder-v0",
        explanation="Seeded from prototype display values. Not computed by any model.",
    ),
    RiskAssessment(
        claim=c202, information_risk="low", potential_impact="medium",
        information_risk_score=0.18, potential_impact_score=0.46,
        propagation_score=0.44, priority=48.0,
        formula_version="seed-placeholder-v0",
        explanation="Seeded from prototype display values. Not computed by any model.",
    ),
    RiskAssessment(
        claim=c203, information_risk="high", potential_impact="high",
        information_risk_score=0.71, potential_impact_score=0.74,
        propagation_score=0.66, priority=92.0,
        formula_version="seed-placeholder-v0",
        explanation="Seeded from prototype display values. Not computed by any model.",
    ),
    RiskAssessment(
        claim=c204, information_risk="medium", potential_impact="medium",
        information_risk_score=0.45, potential_impact_score=0.48,
        propagation_score=0.52, priority=57.0,
        formula_version="seed-placeholder-v0",
        explanation="Seeded from prototype display values. Not computed by any model.",
    ),
])

session.commit()

print(f"Sources:  {session.query(Source).count()}")
print(f"Events:   {session.query(Event).count()}")
print(f"Claims:   {session.query(Claim).count()}")
print(f"Evidence: {session.query(Evidence).count()}")
print(f"Risk:     {session.query(RiskAssessment).count()}")
session.close()