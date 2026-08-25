import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusPill, claimStatusTone, riskTone } from "@/components/status";
import { claims, events } from "@/lib/mock-data";

export const Route = createFileRoute("/events/$eventId")({
  loader: ({ params }) => {
    const event = events.find((e) => e.id === params.eventId);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event unavailable — SATYA IMMUNE X" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const title = `${event.ref} — SATYA IMMUNE X`;
    const description = `${event.type} event in ${event.region}. Status ${event.status}, information risk ${event.risk}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: EventDetail,
});

const kindTone = {
  info: "info",
  warn: "warning",
  alert: "critical",
  official: "success",
} as const;

function EventDetail() {
  const { event } = Route.useLoaderData();
  const related = claims.filter((c) => c.eventId === event.id);

  return (
    <div className="space-y-6">
      <PageHeader title={event.ref} description={event.summary}>
        <Button asChild variant="outline">
          <Link to="/events">Back to events</Link>
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="pt-6">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Location</dt>
              <dd className="mt-1 text-sm font-semibold">{event.region}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Event type</dt>
              <dd className="mt-1 text-sm font-semibold">{event.type}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Status</dt>
              <dd className="mt-1">
                <StatusPill label={event.status} tone={event.status === "Developing" ? "warning" : "info"} />
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                Information risk
              </dt>
              <dd className="mt-1">
                <StatusPill label={event.risk} tone={riskTone(event.risk)} />
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-5 border-l border-border pl-5">
              {event.timeline.map((t) => (
                <li key={t.time + t.label} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[26px] size-2.5 rounded-full border-2 border-background bg-primary"
                  />
                  <p className="font-mono text-xs text-muted-foreground">{t.time}</p>
                  <p className="mt-0.5 text-sm text-foreground">{t.label}</p>
                  <StatusPill
                    className="mt-1.5"
                    label={
                      t.kind === "official"
                        ? "Official update"
                        : t.kind === "alert"
                          ? "Possible misinformation"
                          : t.kind === "warn"
                            ? "Signal increase"
                            : "Information"
                    }
                    tone={kindTone[t.kind]}
                  />
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Event map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-64 w-full overflow-hidden rounded-md border border-border bg-surface">
              <iframe
                title={`Map showing the event location in ${event.region}`}
                loading="lazy"
                className="h-full w-full border-0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.geo.lng - 0.35}%2C${event.geo.lat - 0.25}%2C${event.geo.lng + 0.35}%2C${event.geo.lat + 0.25}&layer=mapnik&marker=${event.geo.lat}%2C${event.geo.lng}`}
              />
              <span className="pointer-events-none absolute bottom-3 left-3 rounded bg-card px-2 py-1 text-xs font-medium text-foreground">
                {event.region}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Approximate event location ({event.geo.lat.toFixed(4)}, {event.geo.lng.toFixed(4)}).
              Evidence locations and environmental sensor markers will appear here when those data
              sources are connected.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Claims linked to this event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {related.map((c) => (
            <div key={c.id} className="rounded-md border border-border p-4">
              <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <StatusPill label={c.status} tone={claimStatusTone(c.status)} />
                <StatusPill label={`Risk: ${c.informationRisk}`} tone={riskTone(c.informationRisk)} />
                <span className="font-mono text-xs text-muted-foreground">
                  Confidence {c.confidence}%
                </span>
                <Link
                  to="/evidence"
                  search={{ claim: c.id }}
                  className="ml-auto text-sm font-medium text-primary hover:underline"
                >
                  Open analysis
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
