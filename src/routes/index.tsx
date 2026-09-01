import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeterBar, PageHeader, StatusPill, claimStatusTone, riskTone } from "@/components/status";
import { claims, dashboardStats, events, environmentalSignals } from "@/lib/mock-data";
import { Activity, MapPin, Clock, Waves, Mountain, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Monitor flood and landslide events, high-priority claims and information risk in one dashboard.",
      },
      { property: "og:title", content: "Dashboard — SATYA IMMUNE X" },
      {
        property: "og:description",
        content:
          "Disaster information intelligence: active events, claims, evidence and information risk.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const priorityClaims = [...claims].sort((a, b) => b.priority - a.priority).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <PageHeader
          title="SATYA IMMUNE X"
          description="Disaster Information Intelligence & Human Resilience"
        >
          <Button asChild>
            <Link to="/claims">Analyse a claim</Link>
          </Button>
        </PageHeader>
        <p className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-1.5 text-sm text-muted-foreground">
          <Activity aria-hidden="true" className="size-4 text-info" />
          Monitoring flood and landslide information
        </p>
      </div>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Overview statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {s.label}
                </p>
                <p className="mt-2 font-mono text-3xl font-bold tabular-nums text-foreground">
                  {s.value}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">{s.hint}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="events-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="events-heading" className="text-lg font-semibold text-foreground">
            Active events
          </h2>
          <Link to="/events" className="text-sm font-medium text-primary hover:underline">
            View all events
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((e) => (
            <Card key={e.id}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span aria-hidden="true">{e.type === "Flood" ? "🌊" : "🏔"}</span>
                  {e.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <StatusPill label={e.status} tone={e.status === "Developing" ? "warning" : "info"} />
                  <StatusPill label={`Risk: ${e.risk}`} tone={riskTone(e.risk)} />
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin aria-hidden="true" className="size-4" /> {e.location}
                </p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock aria-hidden="true" className="size-4" /> Updated {e.updatedAgo}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/events/$eventId" params={{ eventId: e.id }}>
                    View event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="priority-heading" className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle id="priority-heading" className="text-base">
              Highest-priority claims
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorityClaims.map((c) => (
              <div key={c.id} className="rounded-md border border-border p-4">
                <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusPill label={c.status} tone={claimStatusTone(c.status)} />
                  <StatusPill label={`Risk: ${c.informationRisk}`} tone={riskTone(c.informationRisk)} />
                  <span className="font-mono text-xs text-muted-foreground">
                    Priority {c.priority}/100
                  </span>
                  <Link
                    to="/evidence"
                    search={{ claim: c.id }}
                    className="ml-auto text-sm font-medium text-primary hover:underline"
                  >
                    View evidence
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Environmental evidence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="rounded-md bg-neutral-soft px-3 py-2 text-xs text-muted-foreground">
              IoT integration coming in Phase 2 — values below are placeholders.
            </p>
            {environmentalSignals.map((s) => (
              <MeterBar key={s.label} label={s.label} value={s.value} caption={s.state} tone="neutral" />
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
