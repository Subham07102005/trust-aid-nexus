/**
 * DEMO DATA — mock objects shaped like the future backend API responses.
 * Every entity mirrors the planned data model so the UI can be re-pointed at
 * real endpoints without changing components.
 */

export type EventStatus = "Developing" | "Monitoring" | "Stable" | "Resolved";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";
export type ClaimStatus =
  | "Supported"
  | "Contradicted"
  | "Insufficient Evidence"
  | "Needs Verification"
  | "High Information Risk";

export interface DisasterEvent {
  id: string;
  ref: string;
  type: "Flood" | "Landslide";
  title: string;
  location: string;
  region: string;
  status: EventStatus;
  risk: RiskLevel;
  updatedAgo: string;
  summary: string;
  coords: { x: number; y: number };
  /** Real-world location used for the event map. */
  geo: { lat: number; lng: number };
  timeline: { time: string; label: string; kind: "info" | "warn" | "alert" | "official" }[];
  claimIds: string[];
}

export interface EvidenceItem {
  id: string;
  label: string;
  type: "Official" | "News" | "Social" | "IoT";
  relation: "Supports" | "Contradicts" | "Partially supports" | "Unrelated";
  reliability: "High" | "Medium" | "Low" | "Unknown";
  note: string;
  observedAt: string;
}

export interface ManipulationSignal {
  label: string;
  value: number;
  note: string;
}

export interface Claim {
  id: string;
  eventId: string;
  text: string;
  disasterType: "Flood" | "Landslide";
  location: string;
  status: ClaimStatus;
  informationRisk: RiskLevel;
  potentialImpact: RiskLevel;
  confidence: number;
  propagation: "Slow" | "Steady" | "Rapid";
  priority: number;
  lastVerified: string;
  reasons: string[];
  evidence: EvidenceItem[];
  signals: ManipulationSignal[];
}

export const events: DisasterEvent[] = [
  {
    id: "1042",
    ref: "Flood Event #1042",
    type: "Flood",
    title: "Flood — Assam",
    location: "Dibrugarh",
    region: "Dibrugarh, Assam",
    status: "Developing",
    risk: "High",
    updatedAgo: "12 minutes ago",
    summary:
      "Rising water levels reported across several wards. Information volume is increasing faster than official confirmations, which raises the chance of unverified claims spreading.",
    coords: { x: 68, y: 34 },
    geo: { lat: 27.4728, lng: 94.912 },
    timeline: [
      { time: "08:00", label: "Heavy rainfall reports appear", kind: "info" },
      { time: "09:15", label: "Flood-related claims increase", kind: "warn" },
      { time: "10:05", label: "Environmental anomaly detected", kind: "warn" },
      { time: "11:20", label: "Official warning published", kind: "official" },
      { time: "12:10", label: "False evacuation claim begins spreading", kind: "alert" },
    ],
    claimIds: ["c-201", "c-202"],
  },
  {
    id: "1043",
    ref: "Landslide Event #1043",
    type: "Landslide",
    title: "Landslide — Assam",
    location: "Dima Hasao",
    region: "Dima Hasao, Assam",
    status: "Monitoring",
    risk: "Medium",
    updatedAgo: "48 minutes ago",
    summary:
      "Slope instability reported along hill sections after sustained rainfall. Several road-closure claims are circulating with conflicting details.",
    coords: { x: 42, y: 58 },
    geo: { lat: 25.1667, lng: 93.0167 },
    timeline: [
      { time: "06:40", label: "Slope movement reported by residents", kind: "info" },
      { time: "07:55", label: "Road-closure claims appear", kind: "warn" },
      { time: "09:30", label: "Local news reports partial blockage", kind: "info" },
      { time: "10:45", label: "Conflicting reopening claims circulate", kind: "alert" },
    ],
    claimIds: ["c-203"],
  },
  {
    id: "1044",
    ref: "Flood Event #1044",
    type: "Flood",
    title: "Flood — Assam",
    location: "Barpeta",
    region: "Barpeta, Assam",
    status: "Stable",
    risk: "Low",
    updatedAgo: "3 hours ago",
    summary:
      "Water levels receding. Older photographs from previous years are being re-shared as current, creating context confusion.",
    coords: { x: 22, y: 40 },
    geo: { lat: 26.3225, lng: 91.006 },
    timeline: [
      { time: "05:10", label: "Water level decline recorded", kind: "info" },
      { time: "08:20", label: "Archived flood photographs re-shared", kind: "warn" },
    ],
    claimIds: ["c-204"],
  },
];

export const claims: Claim[] = [
  {
    id: "c-203",
    eventId: "1043",
    text: "NH-27 is completely blocked because of a landslide.",
    disasterType: "Landslide",
    location: "NH-27",
    status: "Needs Verification",
    informationRisk: "High",
    potentialImpact: "High",
    confidence: 78,
    propagation: "Rapid",
    priority: 92,
    lastVerified: "9 minutes ago",
    reasons: [
      "Supporting authoritative evidence is currently limited.",
      "Multiple social reports mention the same claim.",
      "The location is relevant to a known landslide event.",
      "The claim contains strong certainty language.",
      "Current evidence does not fully confirm complete road blockage.",
    ],
    evidence: [
      {
        id: "e-1",
        label: "District administration advisory",
        type: "Official",
        relation: "Supports",
        reliability: "High",
        note: "Mentions debris on one carriageway; does not state full closure.",
        observedAt: "10:45",
      },
      {
        id: "e-2",
        label: "Regional news report",
        type: "News",
        relation: "Partially supports",
        reliability: "Medium",
        note: "Reports slow-moving traffic and intermittent restrictions.",
        observedAt: "11:05",
      },
      {
        id: "e-3",
        label: "Public social post",
        type: "Social",
        relation: "Contradicts",
        reliability: "Low",
        note: "Traveller states vehicles are passing in a single lane.",
        observedAt: "11:40",
      },
      {
        id: "e-4",
        label: "Environmental sensor event",
        type: "IoT",
        relation: "Supports",
        reliability: "Unknown",
        note: "Sensor network not connected in this prototype phase.",
        observedAt: "—",
      },
    ],
    signals: [
      { label: "Artificial urgency", value: 82, note: "Time-pressure wording detected." },
      { label: "Fake authority", value: 61, note: "References an unnamed 'official order'." },
      { label: "Emotional language", value: 52, note: "Alarming adjectives above baseline." },
      { label: "Evidence conflict", value: 91, note: "Sources disagree on the closure extent." },
      { label: "Context inconsistency", value: 73, note: "Time references do not align." },
    ],
  },
  {
    id: "c-201",
    eventId: "1042",
    text: "All residents of Dibrugarh have been ordered to evacuate immediately.",
    disasterType: "Flood",
    location: "Dibrugarh, Assam",
    status: "High Information Risk",
    informationRisk: "Critical",
    potentialImpact: "Critical",
    confidence: 84,
    propagation: "Rapid",
    priority: 96,
    lastVerified: "4 minutes ago",
    reasons: [
      "No matching announcement was found in official channels.",
      "The claim uses absolute wording covering an entire district.",
      "Similar wording has appeared in unrelated past events.",
      "Sharing pattern grew unusually quickly within a short window.",
    ],
    evidence: [
      {
        id: "e-5",
        label: "State disaster authority bulletin",
        type: "Official",
        relation: "Contradicts",
        reliability: "High",
        note: "Advisory limited to low-lying wards, not the full district.",
        observedAt: "11:20",
      },
      {
        id: "e-6",
        label: "National news wire",
        type: "News",
        relation: "Partially supports",
        reliability: "Medium",
        note: "Reports localised relocation of families.",
        observedAt: "11:35",
      },
      {
        id: "e-7",
        label: "Messaging forward",
        type: "Social",
        relation: "Supports",
        reliability: "Low",
        note: "Unattributed forwarded message with no source.",
        observedAt: "12:10",
      },
    ],
    signals: [
      { label: "Artificial urgency", value: 94, note: "Immediate-action instruction." },
      { label: "Fake authority", value: 88, note: "Claims an order without naming an issuer." },
      { label: "Emotional language", value: 71, note: "Fear-based framing." },
      { label: "Evidence conflict", value: 86, note: "Official bulletin disagrees." },
      { label: "Context inconsistency", value: 64, note: "Scope inconsistent with bulletin." },
    ],
  },
  {
    id: "c-202",
    eventId: "1042",
    text: "Water level at the Dibrugarh embankment crossed the danger mark this morning.",
    disasterType: "Flood",
    location: "Dibrugarh, Assam",
    status: "Supported",
    informationRisk: "Low",
    potentialImpact: "Medium",
    confidence: 91,
    propagation: "Steady",
    priority: 48,
    lastVerified: "21 minutes ago",
    reasons: [
      "An official gauge reading matches the reported level.",
      "Two independent news reports describe the same measurement.",
      "Reported time and location are internally consistent.",
    ],
    evidence: [
      {
        id: "e-8",
        label: "Water resources department reading",
        type: "Official",
        relation: "Supports",
        reliability: "High",
        note: "Gauge reading published at 09:00.",
        observedAt: "09:00",
      },
      {
        id: "e-9",
        label: "Local newspaper report",
        type: "News",
        relation: "Supports",
        reliability: "Medium",
        note: "Cites the same departmental reading.",
        observedAt: "09:40",
      },
    ],
    signals: [
      { label: "Artificial urgency", value: 18, note: "Neutral wording." },
      { label: "Fake authority", value: 9, note: "Source is named and traceable." },
      { label: "Emotional language", value: 14, note: "Descriptive, not alarming." },
      { label: "Evidence conflict", value: 11, note: "Sources agree." },
      { label: "Context inconsistency", value: 16, note: "Time and place align." },
    ],
  },
  {
    id: "c-204",
    eventId: "1044",
    text: "This photograph shows Barpeta town under water today.",
    disasterType: "Flood",
    location: "Barpeta, Assam",
    status: "Contradicted",
    informationRisk: "Medium",
    potentialImpact: "Medium",
    confidence: 73,
    propagation: "Steady",
    priority: 57,
    lastVerified: "1 hour ago",
    reasons: [
      "A visually similar image appears in older archives.",
      "Current water-level readings do not match the scene.",
      "Landmarks in the image belong to a different area.",
    ],
    evidence: [
      {
        id: "e-10",
        label: "Archive match",
        type: "News",
        relation: "Contradicts",
        reliability: "Medium",
        note: "Near-identical image published in a previous year.",
        observedAt: "08:20",
      },
      {
        id: "e-11",
        label: "District gauge summary",
        type: "Official",
        relation: "Contradicts",
        reliability: "High",
        note: "Levels are receding in the named area.",
        observedAt: "07:00",
      },
    ],
    signals: [
      { label: "Artificial urgency", value: 44, note: "'Today' framing on old material." },
      { label: "Fake authority", value: 21, note: "No authority cited." },
      { label: "Emotional language", value: 58, note: "Distress-focused caption." },
      { label: "Evidence conflict", value: 77, note: "Archive and gauge disagree." },
      { label: "Context inconsistency", value: 89, note: "Date and place mismatch." },
    ],
  },
];

export const dashboardStats = [
  { label: "Active events", value: "03", hint: "Flood and landslide events being monitored" },
  { label: "High-priority claims", value: "08", hint: "Ranked by risk, impact and spread" },
  { label: "Claims requiring verification", value: "21", hint: "Evidence is incomplete" },
  { label: "Sources analysed", value: "142", hint: "Official, news and public sources" },
];

export const resilienceSkills = [
  {
    label: "Source verification",
    value: 78,
    note: "You usually check who published a claim.",
  },
  {
    label: "Context checking",
    value: 52,
    note: "Older material presented as current still gets through.",
  },
  { label: "Fake authority detection", value: 86, note: "You spot unnamed 'official orders'." },
  { label: "Location verification", value: 61, note: "Place names are sometimes accepted as given." },
  { label: "Urgency detection", value: 91, note: "You recognise pressure wording quickly." },
];

export interface TrainingCard {
  id: string;
  title: string;
  explanation: string;
  example: string;
  question: string;
  options: { label: string; correct: boolean }[];
  answerExplanation: string;
}

export const trainingCards: TrainingCard[] = [
  {
    id: "t-1",
    title: "Information taken out of context",
    explanation:
      "During floods and landslides, real photographs and real statements are often re-shared from earlier events. The material is genuine, but the time or place is wrong.",
    example:
      "A photograph of a submerged market is shared with the caption 'Barpeta today', while water levels in Barpeta are currently receding.",
    question: "How should this post be treated?",
    options: [
      { label: "Supported", correct: false },
      { label: "Misleading", correct: true },
      { label: "Needs verification", correct: false },
    ],
    answerExplanation:
      "The image itself is real, but the claim attaches it to the wrong date and place. That makes the post misleading rather than simply false.",
  },
  {
    id: "t-2",
    title: "Unnamed authority",
    explanation:
      "Claims that mention 'official orders' without naming the issuing office are a common misinformation pattern during emergencies.",
    example: "'Officials have ordered the entire district to evacuate immediately.'",
    question: "What is the most responsible reading?",
    options: [
      { label: "Supported", correct: false },
      { label: "Misleading", correct: false },
      { label: "Needs verification", correct: true },
    ],
    answerExplanation:
      "No issuing authority is named, so the claim cannot be confirmed or dismissed from the text alone. Check the relevant official channel before acting.",
  },
  {
    id: "t-3",
    title: "Measured, sourced reporting",
    explanation:
      "Not every alarming post is misinformation. Claims that name a source, a time and a measurement are usually verifiable.",
    example:
      "'The water resources department recorded the embankment gauge above the danger mark at 09:00.'",
    question: "How should this be treated?",
    options: [
      { label: "Supported", correct: true },
      { label: "Misleading", correct: false },
      { label: "Needs verification", correct: false },
    ],
    answerExplanation:
      "A named authority, a specific time and a specific measurement make this claim checkable, and independent reports match it.",
  },
];

export const modelMetrics = [
  { label: "Accuracy", value: 0.87 },
  { label: "Precision", value: 0.84 },
  { label: "Recall", value: 0.81 },
  { label: "F1-score", value: 0.82 },
];

export const claimStatistics = [
  { name: "Flood claims", value: 128 },
  { name: "Landslide claims", value: 74 },
  { name: "Supported", value: 96 },
  { name: "Contradicted", value: 41 },
  { name: "Insufficient evidence", value: 65 },
];

export const riskDistribution = [
  { name: "Low", value: 62 },
  { name: "Medium", value: 71 },
  { name: "High", value: 48 },
  { name: "Critical", value: 21 },
];

export const resilienceSummary = { pre: 54, post: 78 };

export const edgeBenchmarks = [
  { label: "Sensor processing latency", value: "18 ms", note: "Simulated" },
  { label: "CPU inference latency", value: "42 ms", note: "Simulated" },
  { label: "FPGA inference latency", value: "7 ms", note: "Target" },
  { label: "FPGA resource utilisation", value: "34%", note: "Estimated" },
];

export const environmentalSignals = [
  { label: "Rainfall", value: 82, state: "High" },
  { label: "Water level", value: 90, state: "High" },
  { label: "Soil moisture", value: 68, state: "Medium" },
  { label: "Ground tilt", value: 18, state: "Normal" },
];
