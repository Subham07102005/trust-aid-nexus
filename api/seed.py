from datetime import datetime, timezone

from satya_api.db import SessionLocal
from satya_api.models import (
    Claim, ClaimReason, Event, EventTimelineEntry, Evidence, Intervention,
    ManipulationSignal, Post, RiskAssessment, Source,
)

DEMO_DAY = (2026, 6, 14)


def utc(hh, mm, day=None):
    y, m, d = DEMO_DAY if day is None else day
    return datetime(y, m, d, hh, mm, tzinfo=timezone.utc)


session = SessionLocal()

for model in (
    ClaimReason, ManipulationSignal, Evidence, RiskAssessment,
    EventTimelineEntry, Claim, Post, Event, Intervention, Source,
):
    session.query(model).delete()
session.commit()


asdma = Source(
    name="State Disaster Management Authority",
    source_type="official",
    reliability_tier="very_high", reliability_score=0.95,
    rationale="State authority with statutory disaster mandate; issues binding advisories.",
)
wrd = Source(
    name="Water Resources Department",
    source_type="official",
    reliability_tier="very_high", reliability_score=0.92,
    rationale="Operates the gauge network; publishes primary measurements.",
)
district_admin = Source(
    name="District Administration",
    source_type="official",
    reliability_tier="high", reliability_score=0.88,
    rationale="Issues local advisories; authoritative within its district.",
)
national_wire = Source(
    name="National news wire",
    source_type="news",
    reliability_tier="medium", reliability_score=0.65,
    rationale="Established wire service; reports are usually sourced but not primary.",
)
regional_news = Source(
    name="Regional news outlet",
    source_type="news",
    reliability_tier="medium", reliability_score=0.60,
    rationale="Established outlet; single reports are not independently corroborated.",
)
local_news = Source(
    name="Local newspaper",
    source_type="news",
    reliability_tier="medium", reliability_score=0.58,
    rationale="Local coverage; frequently restates official releases rather than observing.",
)
news_archive = Source(
    name="News image archive",
    source_type="news",
    reliability_tier="medium", reliability_score=0.62,
    rationale="Dated published material; useful for establishing prior publication.",
)
public_social = Source(
    name="Public social account (unverified)",
    source_type="social",
    reliability_tier="low", reliability_score=0.20,
    rationale="Unverified account; no institutional accountability.",
)
forwarded_message = Source(
    name="Forwarded message (unattributed)",
    source_type="social",
    reliability_tier="very_low", reliability_score=0.10,
    rationale="No identifiable origin; chain of custody cannot be established.",
)

session.add_all([
    asdma, wrd, district_admin, national_wire, regional_news,
    local_news, news_archive, public_social, forwarded_message,
])
session.flush()

# ----------------------------------------------------------------- events ---

dibrugarh = Event(
    event_type="flood",
    title="Flood — Assam",
    location_text="Dibrugarh, Assam",
    admin_district="Dibrugarh",
    latitude=27.4728, longitude=94.9120, geo_confidence=0.8,
    start_time=utc(8, 0),
    severity="high", status="developing",
    summary=(
        "Rising water levels reported across several wards. Information volume is "
        "increasing faster than official confirmations, which raises the chance of "
        "unverified claims spreading."
    ),
)
dima_hasao = Event(
    event_type="landslide",
    title="Landslide — Assam",
    location_text="Dima Hasao, Assam",
    admin_district="Dima Hasao",
    latitude=25.1667, longitude=93.0167, geo_confidence=0.8,
    start_time=utc(6, 40),
    severity="medium", status="monitoring",
    summary=(
        "Slope instability reported along hill sections after sustained rainfall. "
        "Several road-closure claims are circulating with conflicting details."
    ),
)
barpeta = Event(
    event_type="flood",
    title="Flood — Assam",
    location_text="Barpeta, Assam",
    admin_district="Barpeta",
    latitude=26.3225, longitude=91.0060, geo_confidence=0.8,
    start_time=utc(5, 10),
    severity="low", status="stable",
    summary=(
        "Water levels receding. Older photographs from previous years are being "
        "re-shared as current, creating context confusion."
    ),
)
session.add_all([dibrugarh, dima_hasao, barpeta])
session.flush()


session.add_all([
    EventTimelineEntry(event=dibrugarh, occurred_at=utc(8, 0),
                       label="Heavy rainfall reports appear", kind="info"),
    EventTimelineEntry(event=dibrugarh, occurred_at=utc(9, 15),
                       label="Flood-related claims increase", kind="warn"),
    EventTimelineEntry(event=dibrugarh, occurred_at=utc(10, 5),
                       label="Environmental anomaly detected", kind="warn"),
    EventTimelineEntry(event=dibrugarh, occurred_at=utc(11, 20),
                       label="Official warning published", kind="official"),
    EventTimelineEntry(event=dibrugarh, occurred_at=utc(12, 10),
                       label="False evacuation claim begins spreading", kind="alert"),

    EventTimelineEntry(event=dima_hasao, occurred_at=utc(6, 40),
                       label="Slope movement reported by residents", kind="info"),
    EventTimelineEntry(event=dima_hasao, occurred_at=utc(7, 55),
                       label="Road-closure claims appear", kind="warn"),
    EventTimelineEntry(event=dima_hasao, occurred_at=utc(9, 30),
                       label="Local news reports partial blockage", kind="info"),
    EventTimelineEntry(event=dima_hasao, occurred_at=utc(10, 45),
                       label="Conflicting reopening claims circulate", kind="alert"),

    EventTimelineEntry(event=barpeta, occurred_at=utc(5, 10),
                       label="Water level decline recorded", kind="info"),
    EventTimelineEntry(event=barpeta, occurred_at=utc(8, 20),
                       label="Archived flood photographs re-shared", kind="warn"),
])


c201 = Claim(
    event=dibrugarh,
    claim_text="All residents of Dibrugarh have been ordered to evacuate immediately.",
    claim_type="evacuation",
    disaster_type="flood",
    location_text="Dibrugarh, Assam",
    admin_district="Dibrugarh",
    event_time=utc(12, 10),
    time_precision="hour",
    verification_status="needs_verification",
    confidence=0.84,
    information_risk="critical",
    potential_impact="critical",
    last_verified_at=utc(12, 6),      # "4 minutes ago"
    model_version="seed-manual-v1",
)

c202 = Claim(
    event=dibrugarh,
    claim_text="Water level at the Dibrugarh embankment crossed the danger mark this morning.",
    claim_type="water_level",
    disaster_type="flood",
    location_text="Dibrugarh, Assam",
    admin_district="Dibrugarh",
    # "this morning" is a day-level expression, not an exact hour.
    event_time=utc(9, 0),
    time_precision="day",
    verification_status="supported",
    confidence=0.91,
    information_risk="low",
    potential_impact="medium",
    last_verified_at=utc(11, 49),     # "21 minutes ago"
    model_version="seed-manual-v1",
)

c203 = Claim(
    event=dima_hasao,
    claim_text="NH-27 is completely blocked because of a landslide.",
    claim_type="road_blockage",
    disaster_type="landslide",
    location_text="NH-27",
    admin_district="Dima Hasao",
    event_time=utc(7, 55),
    time_precision="hour",
    verification_status="needs_verification",
    confidence=0.78,
    information_risk="high",
    potential_impact="high",
    last_verified_at=utc(12, 1),      # "9 minutes ago"
    model_version="seed-manual-v1",
)

c204 = Claim(
    event=barpeta,
    claim_text="This photograph shows Barpeta town under water today.",
    claim_type="flood_level",
    disaster_type="flood",
    location_text="Barpeta, Assam",
    admin_district="Barpeta",
    event_time=utc(8, 20),
    time_precision="day",
    verification_status="contradicted",
    confidence=0.73,
    information_risk="medium",
    potential_impact="medium",
    last_verified_at=utc(11, 10),     # "1 hour ago"
    model_version="seed-manual-v1",
)

session.add_all([c201, c202, c203, c204])
session.flush()

# --------------------------------------------------------------- evidence ---
# relevance_score is not present in the prototype and is left NULL rather than
# invented. reliability_score follows the prototype's per-item label.
#
# e8 and e9 are named variables because e9 derives from e8 — see below.

e8 = Evidence(
    claim=c202, source=wrd, evidence_type="bulletin",
    title="Water resources department reading",
    content="Gauge reading published at 09:00.",
    relation="supports",
    reliability_score=0.92, temporal_match=0.95, geographic_match=0.95,
    observed_at=utc(9, 0), location_text="Dibrugarh",
)
e9 = Evidence(
    claim=c202, source=local_news, evidence_type="news_article",
    title="Local newspaper report",
    content="Cites the same departmental reading.",
    relation="supports",
    reliability_score=0.58, temporal_match=0.90, geographic_match=0.90,
    observed_at=utc(9, 40), location_text="Dibrugarh",
)

session.add_all([
    # --- c-201 (e-5, e-6, e-7) ---
    Evidence(
        claim=c201, source=asdma, evidence_type="bulletin",
        title="State disaster authority bulletin",
        content="Advisory limited to low-lying wards, not the full district.",
        relation="contradicts",
        reliability_score=0.95, temporal_match=0.95, geographic_match=0.90,
        observed_at=utc(11, 20), location_text="Dibrugarh",
    ),
    Evidence(
        claim=c201, source=national_wire, evidence_type="news_article",
        title="National news wire",
        content="Reports localised relocation of families.",
        relation="partially_supports",
        reliability_score=0.65, temporal_match=0.90, geographic_match=0.75,
        observed_at=utc(11, 35), location_text="Dibrugarh",
    ),
    Evidence(
        claim=c201, source=forwarded_message, evidence_type="social_post",
        title="Messaging forward",
        content="Unattributed forwarded message with no source.",
        relation="supports",
        reliability_score=0.10, temporal_match=0.70, geographic_match=0.50,
        observed_at=utc(12, 10),
    ),

    # --- c-202 (e-8, e-9) ---
    e8,
    e9,

    # --- c-203 (e-1, e-2, e-3; e-4 deliberately omitted — see note 5) ---
    Evidence(
        claim=c203, source=district_admin, evidence_type="bulletin",
        title="District administration advisory",
        content="Mentions debris on one carriageway; does not state full closure.",
        relation="supports",
        reliability_score=0.88, temporal_match=0.90, geographic_match=0.85,
        observed_at=utc(10, 45), location_text="Dima Hasao",
    ),
    Evidence(
        claim=c203, source=regional_news, evidence_type="news_article",
        title="Regional news report",
        content="Reports slow-moving traffic and intermittent restrictions.",
        relation="partially_supports",
        reliability_score=0.60, temporal_match=0.90, geographic_match=0.80,
        observed_at=utc(11, 5), location_text="NH-27",
    ),
    Evidence(
        claim=c203, source=public_social, evidence_type="social_post",
        title="Public social post",
        content="Traveller states vehicles are passing in a single lane.",
        relation="contradicts",
        reliability_score=0.20, temporal_match=0.85, geographic_match=0.75,
        observed_at=utc(11, 40), location_text="NH-27",
    ),

    # --- c-204 (e-10, e-11) ---
    Evidence(
        claim=c204, source=news_archive, evidence_type="news_article",
        title="Archive match",
        content="Near-identical image published in a previous year.",
        relation="contradicts",
        reliability_score=0.62,
        # Prior-year publication: strong evidence, but deliberately not
        # temporally aligned with the claimed event.
        temporal_match=0.10, geographic_match=0.60,
        observed_at=utc(8, 20),
    ),
    Evidence(
        claim=c204, source=district_admin, evidence_type="bulletin",
        title="District gauge summary",
        content="Levels are receding in the named area.",
        relation="contradicts",
        reliability_score=0.88, temporal_match=0.95, geographic_match=0.95,
        observed_at=utc(7, 0), location_text="Barpeta",
    ),
])

# flush() assigns database ids without committing, so e8.id exists below.
session.flush()

# The newspaper restates the gauge reading; it observes nothing independently.
# Evidence fusion must count one observation here, not two.
e9.derived_from_evidence_id = e8.id

# ---------------------------------------------------------------- reasons ---
# The lines rendered by the "Why this result?" panel. reason_kind classifies
# each one so error analysis can later ask which kind of reasoning fails most.

REASONS = {
    c201: [
        ("No matching announcement was found in official channels.", "evidence_absence"),
        ("The claim uses absolute wording covering an entire district.", "linguistic"),
        ("Similar wording has appeared in unrelated past events.", "linguistic"),
        ("Sharing pattern grew unusually quickly within a short window.", "propagation"),
    ],
    c202: [
        ("An official gauge reading matches the reported level.", "evidence_support"),
        ("Two independent news reports describe the same measurement.", "evidence_support"),
        ("Reported time and location are internally consistent.", "temporal"),
    ],
    c203: [
        ("Supporting authoritative evidence is currently limited.", "evidence_absence"),
        ("Multiple social reports mention the same claim.", "propagation"),
        ("The location is relevant to a known landslide event.", "geographic"),
        ("The claim contains strong certainty language.", "linguistic"),
        ("Current evidence does not fully confirm complete road blockage.", "evidence_conflict"),
    ],
    c204: [
        ("A visually similar image appears in older archives.", "temporal"),
        ("Current water-level readings do not match the scene.", "evidence_conflict"),
        ("Landmarks in the image belong to a different area.", "geographic"),
    ],
}

for claim, rows in REASONS.items():
    for i, (text, kind) in enumerate(rows):
        session.add(ClaimReason(
            claim=claim, text=text, reason_kind=kind,
            position=i, generated_by="seed-manual-v1",
        ))

SIGNALS = {
    c201: [
        ("artificial_urgency", 94, "Immediate-action instruction."),
        ("fake_authority", 88, "Claims an order without naming an issuer."),
        ("emotional_language", 71, "Fear-based framing."),
        ("evidence_conflict", 86, "Official bulletin disagrees."),
        ("context_inconsistency", 64, "Scope inconsistent with bulletin."),
    ],
    c202: [
        ("artificial_urgency", 18, "Neutral wording."),
        ("fake_authority", 9, "Source is named and traceable."),
        ("emotional_language", 14, "Descriptive, not alarming."),
        ("evidence_conflict", 11, "Sources agree."),
        ("context_inconsistency", 16, "Time and place align."),
    ],
    c203: [
        ("artificial_urgency", 82, "Time-pressure wording detected."),
        ("fake_authority", 61, "References an unnamed 'official order'."),
        ("emotional_language", 52, "Alarming adjectives above baseline."),
        ("evidence_conflict", 91, "Sources disagree on the closure extent."),
        ("context_inconsistency", 73, "Time references do not align."),
    ],
    c204: [
        ("artificial_urgency", 44, "'Today' framing on old material."),
        ("fake_authority", 21, "No authority cited."),
        ("emotional_language", 58, "Distress-focused caption."),
        ("evidence_conflict", 77, "Archive and gauge disagree."),
        ("context_inconsistency", 89, "Date and place mismatch."),
    ],
}

for claim, rows in SIGNALS.items():
    for signal_type, value, note in rows:
        session.add(ManipulationSignal(
            claim=claim, signal_type=signal_type,
            value=value / 100.0, note=note,
            method_version="seed-manual-v1",
        ))


PLACEHOLDER = "seed-placeholder-v0"
NOTE = "Seeded from prototype display values. Not computed by any model."

session.add_all([
    RiskAssessment(
        claim=c201, information_risk="critical", potential_impact="critical",
        propagation_score=0.85, priority=96.0,
        formula_version=PLACEHOLDER, explanation=NOTE,
    ),
    RiskAssessment(
        claim=c202, information_risk="low", potential_impact="medium",
        propagation_score=0.50, priority=48.0,
        formula_version=PLACEHOLDER, explanation=NOTE,
    ),
    RiskAssessment(
        claim=c203, information_risk="high", potential_impact="high",
        propagation_score=0.85, priority=92.0,
        formula_version=PLACEHOLDER, explanation=NOTE,
    ),
    RiskAssessment(
        claim=c204, information_risk="medium", potential_impact="medium",
        propagation_score=0.50, priority=57.0,
        formula_version=PLACEHOLDER, explanation=NOTE,
    ),
])

session.commit()

print(f"Sources:  {session.query(Source).count()}")
print(f"Events:   {session.query(Event).count()}")
print(f"Claims:   {session.query(Claim).count()}")
print(f"Evidence: {session.query(Evidence).count()}")
print(f"Risk:     {session.query(RiskAssessment).count()}")
print(f"Reasons:  {session.query(ClaimReason).count()}")
print(f"Signals:  {session.query(ManipulationSignal).count()}")
print(f"Timeline: {session.query(EventTimelineEntry).count()}")
session.close()