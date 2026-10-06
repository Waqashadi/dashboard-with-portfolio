"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Activity,
  BarChart3,
  BookMarked,
  Code2,
  GitBranch,
  LogOut,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/repositories", label: "Repositories", icon: BookMarked },
  { href: "/dashboard/skills", label: "Skills", icon: Code2 },
  { href: "/dashboard/activity", label: "Activity", icon: Activity },
  { href: "/dashboard/github-sync", label: "GitHub Sync", icon: RefreshCw },
];

export function Sidebar() {
  const pathname = usePathname();
  const { mobileOpen, closeMobileSidebar } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close dashboard navigation"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px] md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[17rem] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-3" onClick={closeMobileSidebar}>
            <span className="flex size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <GitBranch className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold tracking-tight">Waqas HaDi</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">Portfolio admin</span>
            </span>
          </Link>
          <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent md:hidden" onClick={closeMobileSidebar} aria-label="Close navigation">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Workspace
        </div>
        <nav aria-label="Dashboard navigation" className="mt-3 flex-1 space-y-1">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileSidebar}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className={`size-[18px] ${active ? "text-primary" : ""}`} aria-hidden="true" />
                {label}
                {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4">
          <button
            type="button"
            onClick={() => void signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
          >
            <LogOut className="size-[18px]" aria-hidden="true" />
            Log out
          </button>
          <Link href="/" className="mt-2 block px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
            View public portfolio
          </Link>
        </div>
      </aside>
    </>
  );
}
