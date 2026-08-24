/**
 * Backend-ready data access layer.
 *
 * Every function here mirrors a planned REST endpoint. While the ML backend is
 * unavailable the functions resolve mock JSON from `mock-data.ts`. Swapping in
 * real endpoints means changing only this file.
 *
 *   POST /api/analyze          -> analyzeClaim
 *   GET  /api/events           -> getEvents
 *   GET  /api/events/{id}      -> getEvent
 *   GET  /api/claims           -> getClaims
 *   GET  /api/claims/{id}      -> getClaim
 *   GET  /api/evidence/{id}    -> getEvidence
 *   GET  /api/resilience/{id}  -> getResilience
 *   GET  /api/analytics        -> getAnalytics
 */

import {
  claims,
  events,
  resilienceSkills,
  resilienceSummary,
  modelMetrics,
  claimStatistics,
  riskDistribution,
  type Claim,
} from "./mock-data";

export const DEMO_MODE = true;

const delay = (ms = 550) => new Promise((r) => setTimeout(r, ms));

export async function getEvents() {
  return events;
}

export async function getEvent(id: string) {
  return events.find((e) => e.id === id) ?? null;
}

export async function getClaims() {
  return claims;
}

export async function getClaim(id: string) {
  return claims.find((c) => c.id === id) ?? null;
}

export async function getEvidence(claimId: string) {
  return (await getClaim(claimId))?.evidence ?? [];
}

export async function getResilience() {
  return { skills: resilienceSkills, summary: resilienceSummary };
}

export async function getAnalytics() {
  return { modelMetrics, claimStatistics, riskDistribution, resilienceSummary };
}

/** Mock analyzer: matches the closest known demo claim, else returns a cautious result. */
export async function analyzeClaim(text: string): Promise<Claim> {
  await delay();
  const normalised = text.toLowerCase();
  const keywordMatch = claims.find((c) => {
    const words = c.text.toLowerCase().split(/\W+/).filter((w) => w.length > 4);
    return words.some((w) => normalised.includes(w));
  });
  if (keywordMatch) return { ...keywordMatch, text };

  const fallback = claims[0]!;
  return {
    ...fallback,
    id: "c-adhoc",
    text,
    status: "Insufficient Evidence",
    informationRisk: "Medium",
    potentialImpact: "Medium",
    confidence: 46,
    priority: 51,
    propagation: "Steady",
    lastVerified: "just now",
    reasons: [
      "No matching official record was found in the demonstration dataset.",
      "The claim could not be linked to an active flood or landslide event.",
      "Location and time details are incomplete.",
      "Verify with the relevant official authority before acting on this claim.",
    ],
    evidence: [],
  };
}
