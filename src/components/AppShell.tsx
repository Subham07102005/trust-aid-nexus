import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Waves,
  SearchCheck,
  FileSearch,
  ShieldCheck,
  BarChart3,
  Info,
  Network,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/events", label: "Events", icon: Waves },
  { to: "/claims", label: "Claim analysis", icon: SearchCheck },
  { to: "/evidence", label: "Evidence", icon: FileSearch },
  { to: "/resilience", label: "Resilience", icon: ShieldCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/about", label: "About SATYA IMMUNE", icon: Info },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          activeProps={{
            className: "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
          }}
        >
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="block focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <span className="block text-base font-bold tracking-tight text-foreground">
        SATYA IMMUNE X
      </span>
      <span className="block text-xs text-muted-foreground">
        Disaster Information Intelligence
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div
        role="note"
        className="flex items-center justify-center gap-2 border-b border-warning/30 bg-warning-soft px-4 py-1.5 text-center text-xs font-medium text-foreground"
      >
        <span className="rounded-sm bg-warning px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-warning-foreground uppercase">
          Demo data
        </span>
        <span>Prototype for research and demonstration — not a live emergency service.</span>
      </div>

      <div className="mx-auto flex w-full max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:block">
          <Brand />
          <div className="mt-6">
            <NavList />
          </div>
          <p className="mt-8 border-t border-sidebar-border pt-4 text-xs leading-relaxed text-muted-foreground">
            AI assessments are estimates. Always confirm emergency instructions with the relevant
            official authority.
          </p>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
              Menu
            </button>
          </header>
          {open && (
            <div id="mobile-nav" className="border-b border-border bg-sidebar px-4 py-3 lg:hidden">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          )}

          <main className={cn("px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>{children}</main>

          <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground sm:px-6 lg:px-8">
            SATYA IMMUNE X — an information-analysis and resilience platform. It does not issue
            emergency instructions.
          </footer>
        </div>
      </div>
    </div>
  );
}
