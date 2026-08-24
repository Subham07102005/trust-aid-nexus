import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, StatusPill, relationTone } from "@/components/status";
import { ClaimResult } from "@/components/ClaimResult";
import { claims } from "@/lib/mock-data";

const searchSchema = z.object({ claim: z.string().optional() });

export const Route = createFileRoute("/evidence")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Evidence — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Compare official, news, public and environmental evidence for flood and landslide claims.",
      },
      { property: "og:title", content: "Evidence — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Evidence panels by source category, with relation and reliability signals.",
      },
    ],
  }),
  component: EvidencePage,
});

const categories = [
  { type: "Official", label: "Official sources" },
  { type: "News", label: "News sources" },
  { type: "Social", label: "Public / social sources" },
  { type: "IoT", label: "Environmental sensors" },
] as const;

function EvidencePage() {
  const { claim: claimId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const selected = claims.find((c) => c.id === claimId) ?? claims[0]!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence"
        description="Evidence is grouped by source category. Each item shows how it relates to the claim and how reliable that signal is."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select a claim</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {claims.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === selected.id}
                onClick={() => navigate({ search: { claim: c.id } })}
                className={`rounded-md border px-4 py-3 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
                  c.id === selected.id
                    ? "border-primary bg-surface font-medium"
                    : "border-border hover:bg-surface"
                }`}
              >
                {c.text}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <section aria-label="Evidence by source category" className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const items = selected.evidence.filter((e) => e.type === cat.type);
          const relation = items[0]?.relation;
          return (
            <Card key={cat.type}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{cat.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusPill
                  label={
                    cat.type === "IoT" && items.every((i) => i.reliability === "Unknown")
                      ? "Not available"
                      : (relation ?? "Not available")
                  }
                  tone={
                    items.length === 0 || (cat.type === "IoT" && relation === undefined)
                      ? "neutral"
                      : relationTone(relation!)
                  }
                />
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {cat.type === "IoT"
                      ? "IoT integration coming in Phase 2. Sensor evidence will appear here automatically."
                      : "No evidence recorded for this category in the demonstration dataset."}
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((i) => (
                      <li key={i.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                        <p className="text-sm font-medium text-foreground">{i.label}</p>
                        <p className="text-xs text-muted-foreground">{i.note}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">
                          Observed {i.observedAt} · Reliability {i.reliability}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      <ClaimResult claim={selected} />
    </div>
  );
}
