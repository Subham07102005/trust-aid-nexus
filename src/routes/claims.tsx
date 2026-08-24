import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/status";
import { ClaimResult } from "@/components/ClaimResult";
import { analyzeClaim } from "@/lib/api";
import type { Claim } from "@/lib/mock-data";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/claims")({
  head: () => ({
    meta: [
      { title: "Claim analysis — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "Check a flood or landslide claim against evidence, information risk, potential impact and a plain-language explanation.",
      },
      { property: "og:title", content: "Claim analysis — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Analyse a disaster-related claim and see the evidence behind the assessment.",
      },
    ],
  }),
  component: ClaimAnalysis,
});

const examples = [
  "NH-27 is completely blocked because of a landslide.",
  "All residents of Dibrugarh have been ordered to evacuate immediately.",
  "This photograph shows Barpeta town under water today.",
];

function ClaimAnalysis() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Claim | null>(null);

  async function onAnalyze(value: string) {
    const claimText = value.trim();
    if (claimText.length < 8) {
      setError("Please enter a claim of at least 8 characters so it can be analysed.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      setResult(await analyzeClaim(claimText));
    } catch {
      setError("The analysis service could not be reached. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Claim analysis"
        description="Enter a disaster-related claim. The prototype compares it with demonstration evidence and explains the result in plain language."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Enter a disaster-related claim</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="claim-input">Claim text</Label>
            <Textarea
              id="claim-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="e.g. NH-27 is completely blocked because of a landslide."
              className="mt-1.5"
              aria-describedby={error ? "claim-error" : undefined}
              aria-invalid={Boolean(error)}
            />
            {error && (
              <p id="claim-error" role="alert" className="mt-2 text-sm font-medium text-critical">
                {error}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => onAnalyze(text)} disabled={loading}>
              {loading && <Loader2 aria-hidden="true" className="mr-2 size-4 animate-spin" />}
              {loading ? "Analysing…" : "Analyse claim"}
            </Button>
            <span aria-live="polite" className="text-sm text-muted-foreground">
              {loading ? "Comparing the claim with available evidence." : ""}
            </span>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Try a demonstration claim
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => {
                    setText(ex);
                    void onAnalyze(ex);
                  }}
                  className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {result && <ClaimResult claim={result} />}
    </div>
  );
}
