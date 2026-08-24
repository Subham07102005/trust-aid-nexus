import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MeterBar,
  StatusPill,
  claimStatusTone,
  relationTone,
  riskTone,
  signalTone,
} from "@/components/status";
import type { Claim } from "@/lib/mock-data";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export function ClaimResult({ claim }: { claim: Claim }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Claim assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <blockquote className="border-l-2 border-primary pl-4 text-base leading-relaxed text-foreground">
            {claim.text}
          </blockquote>

          <div className="flex flex-wrap gap-2">
            <StatusPill label={claim.status} tone={claimStatusTone(claim.status)} />
            <StatusPill
              label={`Information risk: ${claim.informationRisk}`}
              tone={riskTone(claim.informationRisk)}
            />
            <StatusPill
              label={`Potential impact: ${claim.potentialImpact}`}
              tone={riskTone(claim.potentialImpact)}
            />
          </div>

          <dl className="grid grid-cols-2 gap-4 border-t border-border pt-4 sm:grid-cols-4">
            <Field label="Disaster type" value={claim.disasterType} />
            <Field label="Location" value={claim.location} />
            <Field label="Confidence" value={`${claim.confidence}%`} />
            <Field label="Last verified" value={claim.lastVerified} />
          </dl>

          <p className="rounded-md bg-info-soft px-3 py-2 text-xs leading-relaxed text-foreground">
            This is a system-generated assessment, not an official emergency instruction. If the
            claim concerns evacuation, closure or rescue, verify it with the relevant official
            authority.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Why this result?</CardTitle>
          </CardHeader>
          <CardContent>
            {claim.reasons.length === 0 ? (
              <p className="text-sm text-muted-foreground">No explanation available.</p>
            ) : (
              <ul className="space-y-2.5">
                {claim.reasons.map((r) => (
                  <li key={r} className="flex gap-2.5 text-sm leading-relaxed text-foreground">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Priority assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid grid-cols-3 gap-3">
              <Field label="Risk" value={claim.informationRisk} />
              <Field label="Impact" value={claim.potentialImpact} />
              <Field label="Propagation" value={claim.propagation} />
            </dl>
            <MeterBar
              label="Priority score"
              value={claim.priority}
              suffix="/100"
              tone={signalTone(claim.priority)}
              caption="System-generated estimate combining risk, impact and how quickly the claim is spreading."
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Information manipulation signals</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {claim.signals.map((s) => (
            <MeterBar
              key={s.label}
              label={s.label}
              value={s.value}
              tone={signalTone(s.value)}
              caption={s.note}
            />
          ))}
          <p className="text-xs text-muted-foreground sm:col-span-2">
            These indicators describe language and evidence patterns in the demonstration dataset.
            They are not scientifically validated scores.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evidence comparison</CardTitle>
          </CardHeader>
          <CardContent>
            {claim.evidence.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No evidence records matched this claim in the demonstration dataset.
              </p>
            ) : (
              <div className="-mx-2 overflow-x-auto px-2">
                <table className="w-full min-w-[520px] text-sm">
                  <caption className="sr-only">Evidence compared against the claim</caption>
                  <thead>
                    <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                      <th scope="col" className="py-2 pr-3 font-medium">Evidence</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Type</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Relation</th>
                      <th scope="col" className="py-2 font-medium">Reliability signal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claim.evidence.map((e) => (
                      <tr key={e.id} className="border-b border-border/70 last:border-0">
                        <td className="py-3 pr-3">
                          <span className="font-medium text-foreground">{e.label}</span>
                          <span className="block text-xs text-muted-foreground">{e.note}</span>
                        </td>
                        <td className="py-3 pr-3 text-muted-foreground">{e.type}</td>
                        <td className="py-3 pr-3">
                          <StatusPill label={e.relation} tone={relationTone(e.relation)} />
                        </td>
                        <td className="py-3 text-muted-foreground">{e.reliability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Claim – evidence relationship</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border bg-surface p-4">
              <p className="font-mono text-xs font-semibold tracking-wide text-foreground">CLAIM</p>
              <ul className="mt-2 space-y-2 border-l border-border pl-4">
                {claim.evidence.map((e) => (
                  <li key={e.id} className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
                      └─
                    </span>
                    <span className="text-foreground">{e.type} source</span>
                    <StatusPill label={e.relation} tone={relationTone(e.relation)} />
                  </li>
                ))}
                {claim.evidence.length === 0 && (
                  <li className="text-sm text-muted-foreground">No linked evidence yet.</li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
