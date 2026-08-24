import { cn } from "@/lib/utils";
import type { ClaimStatus, RiskLevel } from "@/lib/mock-data";

type Tone = "success" | "warning" | "critical" | "info" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/30",
  warning: "bg-warning-soft text-warning border-warning/30",
  critical: "bg-critical-soft text-critical border-critical/30",
  info: "bg-info-soft text-info border-info/30",
  neutral: "bg-neutral-soft text-muted-foreground border-border",
};

const toneSymbol: Record<Tone, string> = {
  success: "✓",
  warning: "!",
  critical: "▲",
  info: "i",
  neutral: "—",
};

export function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono text-[10px]">
        {toneSymbol[tone]}
      </span>
      {label}
    </span>
  );
}

export function claimStatusTone(status: ClaimStatus): Tone {
  switch (status) {
    case "Supported":
      return "success";
    case "Contradicted":
      return "critical";
    case "High Information Risk":
      return "critical";
    case "Needs Verification":
      return "warning";
    default:
      return "neutral";
  }
}

export function riskTone(risk: RiskLevel): Tone {
  switch (risk) {
    case "Low":
      return "success";
    case "Medium":
      return "warning";
    case "High":
      return "critical";
    case "Critical":
      return "critical";
  }
}

export function relationTone(relation: string): Tone {
  if (relation === "Supports") return "success";
  if (relation === "Contradicts") return "critical";
  if (relation === "Partially supports") return "warning";
  return "neutral";
}

export function MeterBar({
  label,
  value,
  caption,
  tone = "info",
  suffix = "%",
}: {
  label: string;
  value: number;
  caption?: string;
  tone?: Tone;
  suffix?: string;
}) {
  const barTone: Record<Tone, string> = {
    success: "bg-success",
    warning: "bg-warning",
    critical: "bg-critical",
    info: "bg-info",
    neutral: "bg-muted-foreground",
  };
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-neutral-soft"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", barTone[tone])}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

export function signalTone(value: number): Tone {
  if (value >= 75) return "critical";
  if (value >= 45) return "warning";
  return "success";
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
