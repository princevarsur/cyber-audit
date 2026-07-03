"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/company", label: "Company Profile", icon: "building" },
  { href: "/assets", label: "Asset Inventory", icon: "server" },
  { href: "/risks", label: "Risk Register", icon: "alert" },
  { href: "/controls", label: "Control Library", icon: "shield" },
  { href: "/compliance", label: "Compliance Mapping", icon: "check" },
  { href: "/policies", label: "Policy Library", icon: "doc" },
  { href: "/gaps", label: "Gap Assessment", icon: "gap" },
  { href: "/executive", label: "Executive Report", icon: "chart" },
];

// Minimal inline icon set (no external icon dependency).
function Icon({ name }: { name: string }) {
  const common = "h-4 w-4 shrink-0";
  const paths: Record<string, JSX.Element> = {
    grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
    building: <path d="M3 21h18M5 21V5a2 2 0 012-2h6a2 2 0 012 2v16M9 7h.01M9 11h.01M9 15h.01" />,
    server: <path d="M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01" />,
    alert: <path d="M12 9v4m0 4h.01M10.3 3.9l-8 14A2 2 0 004 21h16a2 2 0 001.7-3l-8-14a2 2 0 00-3.4 0z" />,
    shield: <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
    check: <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />,
    doc: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h8" />,
    gap: <path d="M3 6h7M14 6h7M3 12h4M17 12h4M3 18h7M14 18h7" />,
    chart: <path d="M3 3v18h18M7 15l3-4 3 3 5-7" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={common}>
      {paths[name]}
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-edge bg-surface md:flex md:flex-col">
      <div className="flex items-center gap-2.5 border-b border-edge px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand ring-1 ring-brand/30">
          <Icon name="shield" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">GRC Dashboard</p>
          <p className="text-xs text-slate-400">SecureHealth Inc.</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-brand/15 text-brand ring-1 ring-brand/30"
                  : "text-slate-300 hover:bg-surface2 hover:text-white"
              }`}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-edge px-5 py-4 text-xs text-slate-500">
        NIST CSF 2.0 · HIPAA aligned
      </div>
    </aside>
  );
}
