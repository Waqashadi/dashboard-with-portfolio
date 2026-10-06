"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Menu } from "lucide-react";
import { DashboardNavbar } from "@/components/ui/DashboardNavbar";
import { Sidebar } from "@/components/dashboard/SideBar";
import { useSidebar } from "@/context/SidebarContext";

const sectionTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/profile": "Profile",
  "/dashboard/repositories": "Repositories",
  "/dashboard/skills": "Skills",
  "/dashboard/activity": "Activity",
  "/dashboard/analytics": "Analytics",
  "/dashboard/github-sync": "GitHub Sync",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { toggleMobileSidebar } = useSidebar();

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [pathname, router, status]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-sm" role="status">
          <Loader2 className="size-4 animate-spin text-primary" />
          {status === "unauthenticated" ? "Redirecting to sign in…" : "Checking your session…"}
        </div>
      </div>
    );
  }

  const title = sectionTitles[pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="min-h-screen md:pl-[17rem]">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[4.25rem] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={toggleMobileSidebar}
                aria-label="Open dashboard navigation"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground md:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
                <h1 className="truncate text-sm font-semibold tracking-tight">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline">
                View site
              </Link>
              <span className="hidden h-5 w-px bg-border sm:block" />
              <DashboardNavbar />
            </div>
          </div>
        </header>
        <main id="main-content" className="mx-auto w-full max-w-[1500px] space-y-7 px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
