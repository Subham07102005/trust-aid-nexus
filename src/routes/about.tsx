import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/status";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "SATYA IMMUNE X is an AI-assisted platform that assesses and explains disaster-related information during floods and landslides.",
      },
      { property: "og:title", content: "About SATYA IMMUNE X" },
      {
        property: "og:description",
        content:
          "How the platform analyses claims, weighs evidence and builds human misinformation resilience.",
      },
    ],
  }),
  component: AboutPage,
});

const steps = [
  "Information",
  "Event detection",
  "Claim analysis",
  "Evidence",
  "Risk assessment",
  "Explanation",
  "User resilience",
];

const audiences = [
  { title: "General public", text: "Check whether a disaster-related claim can be trusted." },
  { title: "Students and researchers", text: "Explore how disaster information spreads and changes." },
  { title: "Information analysts", text: "Identify which claims need attention first." },
  { title: "Evaluators", text: "Understand the system quickly during a demonstration." },
];

function AboutPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About SATYA IMMUNE X"
        description="Disaster Information Intelligence & Human Resilience"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What is SATYA IMMUNE X?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-foreground">
          <p>
            SATYA IMMUNE X is an AI-assisted disaster information intelligence platform designed to
            help identify, assess and explain potentially misleading information during floods and
            landslides.
          </p>
          <p>
            It does not simply label posts as true or false. Disaster information changes quickly, so
            the platform works at the level of events and claims: it compares evidence, estimates
            information risk and possible impact, explains its reasoning, and communicates how
            certain or uncertain that reasoning is.
          </p>
          <p className="rounded-md bg-warning-soft px-3 py-2">
            SATYA IMMUNE X is an information-analysis and resilience platform, not an emergency
            authority. It never issues autonomous instructions. When a claim mentions an evacuation
            or closure, it asks you to verify with the relevant official authority.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How it works</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground">
                  {s}
                </span>
                {i < steps.length - 1 && (
                  <span aria-hidden="true" className="text-muted-foreground">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">How results are described</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          {[
            ["Supported", "Reliable evidence agrees with the claim."],
            ["Contradicted", "Reliable evidence disagrees with the claim."],
            ["Insufficient evidence", "Not enough evidence exists to judge the claim yet."],
            ["Needs verification", "Evidence is mixed or incomplete; confirm before acting."],
            ["High information risk", "The claim could cause harm if it spreads unchecked."],
          ].map(([label, text]) => (
            <div key={label} className="rounded-md border border-border p-3">
              <p className="font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-muted-foreground">{text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Who it is for</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {audiences.map((a) => (
            <div key={a.title} className="rounded-md border border-border p-3 text-sm">
              <p className="font-semibold text-foreground">{a.title}</p>
              <p className="mt-1 text-muted-foreground">{a.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        For the processing pipeline and future modules, see the{" "}
        <Link to="/architecture" className="font-medium text-primary hover:underline">
          technical architecture
        </Link>
        .
      </p>
    </div>
  );
}
