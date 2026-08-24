import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusPill, riskTone } from "@/components/status";
import { events } from "@/lib/mock-data";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Events — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Flood and landslide events currently monitored, with status, information risk and location.",
      },
      { property: "og:title", content: "Events — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Monitored flood and landslide events with status and information risk.",
      },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <div>
      <PageHeader
        title="Events"
        description="Flood and landslide events currently tracked. Open an event to see its timeline, map and related claims."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e) => (
          <Card key={e.id}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between gap-3 text-base">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{e.type === "Flood" ? "🌊" : "🏔"}</span>
                  {e.title}
                </span>
                <span className="font-mono text-xs text-muted-foreground">#{e.id}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">{e.summary}</p>
              <div className="flex flex-wrap gap-2">
                <StatusPill label={e.status} tone={e.status === "Developing" ? "warning" : "info"} />
                <StatusPill label={`Risk: ${e.risk}`} tone={riskTone(e.risk)} />
                <StatusPill label={e.region} tone="neutral" />
              </div>
              <Button asChild variant="outline">
                <Link to="/events/$eventId" params={{ eventId: e.id }}>
                  View event
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
