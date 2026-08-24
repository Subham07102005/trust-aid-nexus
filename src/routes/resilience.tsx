import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MeterBar, PageHeader, StatusPill, signalTone } from "@/components/status";
import { resilienceSkills, resilienceSummary, trainingCards } from "@/lib/mock-data";

export const Route = createFileRoute("/resilience")({
  head: () => ({
    meta: [
      { title: "My information resilience — SATYA IMMUNE X" },
      {
        name: "description",
        content:
          "See how well you recognise disaster misinformation patterns and take short, targeted prebunking training.",
      },
      { property: "og:title", content: "My information resilience — SATYA IMMUNE X" },
      {
        property: "og:description",
        content: "Personalised prebunking training and retesting for disaster misinformation.",
      },
    ],
  }),
  component: ResiliencePage,
});

function ResiliencePage() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const card = trainingCards[step]!;
  const chosen = answers[card.id];
  const correctCount = trainingCards.filter(
    (c) => c.options.find((o) => o.correct)?.label === answers[c.id],
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My information resilience"
        description="SATYA IMMUNE evaluates how well you recognise common misinformation patterns and provides short, personalised training."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resilience profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resilienceSkills.map((s) => (
              <MeterBar
                key={s.label}
                label={s.label}
                value={s.value}
                caption={s.note}
                tone={s.value >= 75 ? "success" : s.value >= 55 ? "warning" : "critical"}
              />
            ))}
            <p className="text-xs text-muted-foreground">
              Demonstration profile. Real scores will be generated from your own test answers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommended training</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground">
              Your current results suggest that you need more practice identifying information taken
              out of context.
            </p>
            {!started && (
              <Button onClick={() => setStarted(true)}>Start 2-minute training</Button>
            )}

            {started && !finished && (
              <div className="space-y-4 rounded-md border border-border p-4">
                <p className="font-mono text-xs text-muted-foreground">
                  Step {step + 1} of {trainingCards.length}
                </p>
                <h2 className="text-sm font-semibold text-foreground">{card.title}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.explanation}</p>
                <p className="rounded-md bg-surface px-3 py-2 text-sm text-foreground">
                  Example: {card.example}
                </p>
                <fieldset>
                  <legend className="text-sm font-medium text-foreground">{card.question}</legend>
                  <div className="mt-2 flex flex-col gap-2">
                    {card.options.map((o) => (
                      <label
                        key={o.label}
                        className="flex cursor-pointer items-center gap-3 rounded-md border border-border px-3 py-2 text-sm hover:bg-surface"
                      >
                        <input
                          type="radio"
                          name={card.id}
                          value={o.label}
                          checked={chosen === o.label}
                          onChange={() => setAnswers((a) => ({ ...a, [card.id]: o.label }))}
                          className="size-4 accent-[var(--primary)]"
                        />
                        {o.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {chosen && (
                  <div className="space-y-2 rounded-md bg-info-soft px-3 py-2">
                    <StatusPill
                      label={
                        card.options.find((o) => o.label === chosen)?.correct
                          ? "Correct"
                          : "Not quite"
                      }
                      tone={card.options.find((o) => o.label === chosen)?.correct ? "success" : "warning"}
                    />
                    <p className="text-sm leading-relaxed text-foreground">
                      {card.answerExplanation}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    Back
                  </Button>
                  <Button
                    disabled={!chosen}
                    onClick={() =>
                      step === trainingCards.length - 1
                        ? setFinished(true)
                        : setStep((s) => s + 1)
                    }
                  >
                    {step === trainingCards.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            )}

            {finished && (
              <div className="space-y-4 rounded-md border border-border p-4">
                <h2 className="text-sm font-semibold text-foreground">Quick test result</h2>
                <p className="text-sm text-foreground">
                  You answered {correctCount} of {trainingCards.length} examples correctly.
                </p>
                <MeterBar
                  label="Before training"
                  value={resilienceSummary.pre}
                  tone={signalTone(100 - resilienceSummary.pre)}
                />
                <MeterBar label="After training" value={resilienceSummary.post} tone="success" />
                <p className="text-sm font-semibold text-success">
                  Improvement: +{resilienceSummary.post - resilienceSummary.pre}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Demonstration data — comparison scores appear once real pre- and post-test results
                  are recorded.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFinished(false);
                    setStarted(false);
                    setStep(0);
                    setAnswers({});
                  }}
                >
                  Retake training
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
