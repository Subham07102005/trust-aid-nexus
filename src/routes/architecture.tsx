import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusPill } from "@/components/status";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Technical architecture — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Simplified processing pipeline, data model and planned API surface behind SATYA IMMUNE X.",
      },
      { property: "og:title", content: "Technical architecture — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Pipeline, entities and planned endpoints for the disaster information platform.",
      },
    ],
  }),
  component: ArchitecturePage,
});

const pipeline = [
  "Public information",
  "Data ingestion",
  "Event detection",
  "Claim engine",
  "Evidence engine",
  "Risk engine",
  "Explanation",
  "Resilience engine",
  "Dashboard",
];

const detailed = [
  "Flood / landslide classification",
  "Claim extraction",
  "Location and time extraction",
  "Claim clustering",
  "Duplicate filtering",
  "Evidence retrieval",
  "Source analysis",
  "Temporal and geographic consistency",
  "Manipulation signal analysis",
  "Risk × impact × propagation",
  "Priority assessment",
  "Explainable result",
  "Adaptive prebunking",
  "User retesting",
];

const endpoints = [
  "POST /api/analyze",
  "GET  /api/events",
  "GET  /api/events/{id}",
  "GET  /api/claims",
  "GET  /api/claims/{id}",
  "GET  /api/evidence/{claim_id}",
  "GET  /api/resilience/{user_id}",
  "POST /api/prebunk",
  "POST /api/test",
  "GET  /api/analytics",
];

function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Technical architecture"
        description="A simplified view of how information moves through the platform, and how the prototype is prepared for a real backend."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Processing pipeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ol className="grid gap-2 sm:grid-cols-3">
            {pipeline.map((p, i) => (
              <li
                key={p}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground"
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ol>
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Stages inside the engines
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {detailed.map((d) => (
                <li
                  key={d}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed border-border p-3 text-sm">
            <StatusPill label="Optional, later phase" tone="neutral" />
            <span className="text-muted-foreground">
              IoT sensors → Edge / FPGA processing → Environmental evidence
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core entities</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-md bg-surface p-4 font-mono text-xs leading-relaxed text-foreground">
{`Event
 ├── Claims
 │     ├── Posts
 │     └── Evidence (Source)
 └── Sensor events

User
 ├── Tests
 ├── Interventions
 └── Resilience profile`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Planned API surface</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 font-mono text-xs text-foreground">
              {endpoints.map((e) => (
                <li key={e} className="rounded bg-surface px-3 py-1.5">
                  {e}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              The interface reads all data through a single access layer, so these endpoints can
              replace the mock responses without UI changes.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Development phases</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 sm:grid-cols-2">
            {[
              "Phase 1 — UI prototype with mock data (current)",
              "Phase 2 — Flood and landslide dataset",
              "Phase 3 — ML: classification, claim extraction, manipulation detection",
              "Phase 4 — Backend APIs",
              "Phase 5 — Evidence engine",
              "Phase 6 — Risk engine",
              "Phase 7 — Human resilience engine",
              "Phase 8 — Permitted public data sources",
              "Phase 9 — IoT environmental evidence",
              "Phase 10 — FPGA edge anomaly detection",
            ].map((p, i) => (
              <li
                key={p}
                className={`rounded-md border px-3 py-2 text-sm ${
                  i === 0 ? "border-primary bg-surface font-medium" : "border-border text-muted-foreground"
                }`}
              >
                {p}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
