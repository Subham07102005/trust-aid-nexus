import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MeterBar, PageHeader, StatusPill } from "@/components/status";
import {
  claimStatistics,
  edgeBenchmarks,
  modelMetrics,
  resilienceSummary,
  riskDistribution,
} from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Model performance, claim statistics, risk distribution and edge-processing benchmarks for the prototype.",
      },
      { property: "og:title", content: "Analytics — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Prototype metrics: model performance, claim statistics and risk distribution.",
      },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Research and administration view. All figures below come from the demonstration dataset."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model performance</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {modelMetrics.map((m) => (
              <div key={m.label} className="rounded-md border border-border p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">{m.label}</p>
                <p className="mt-1 font-mono text-2xl font-bold tabular-nums">{m.value.toFixed(2)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Claim statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimStatistics} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={140}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User resilience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MeterBar label="Pre-test average" value={resilienceSummary.pre} tone="warning" />
            <MeterBar label="Post-test average" value={resilienceSummary.post} tone="success" />
            <p className="text-sm font-semibold text-success">
              Improvement: +{resilienceSummary.post - resilienceSummary.pre}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-3 text-base">
              Edge processing
              <StatusPill label="Prototype" tone="neutral" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              {edgeBenchmarks.map((b) => (
                <div key={b.label} className="flex items-baseline justify-between gap-3">
                  <dt className="text-sm text-foreground">{b.label}</dt>
                  <dd className="font-mono text-sm tabular-nums text-muted-foreground">
                    {b.value} <span className="text-xs">({b.note})</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Edge and FPGA figures are planning targets for a later phase and are included for
              technical evaluation only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
