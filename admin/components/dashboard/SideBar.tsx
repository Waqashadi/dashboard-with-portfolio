"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  ClipboardList,
  CheckSquare,
  Plane,
  ShoppingCart,
  Wallet,
  School,
  ChevronsLeft,
  ChevronsRight,
  X,
  type LucideIcon,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";


const NAV_ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/programs",
    label: "Programs & Institutions",
    icon: Building2,
  },
  {
    href: "/students",
    label: "Students",
    icon: GraduationCap,
  },
  {
    href: "/applications",
    label: "Applications",
    icon: ClipboardList,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    href: "/trainings",
    label: "Destination Trainings",
    icon: Plane,
  },
  {
    href: "/tests",
    label: "Buy Tests",
    icon: ShoppingCart,
  },
  {
    href: "/profile",
    label: "Accounts",
    icon: Wallet,
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const {
    mobileOpen,
    closeMobileSidebar,
  } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeMobileSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex h-screen",
          "shrink-0 flex-col overflow-hidden",
          "border-r border-border bg-sidebar p-4",
          "transition-all duration-300",

          // Mobile drawer
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full",

          // Desktop
          "md:static md:translate-x-0",

          // Desktop width
          collapsed
            ? "md:w-28"
            : "md:w-64",

          // Mobile width
          "w-72",
        ].join(" ")}
      >
        {/* Header */}
        <div
          className={[
            "flex items-center gap-x-4 -mt-2",
            collapsed
              ? "md:justify-center"
              : "",
          ].join(" ")}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            <School className="h-5 w-5" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold text-sidebar-foreground">
                Agent Portal
              </p>
            </div>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="ml-auto rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink
              key={item.href}
              {...item}
              collapsed={collapsed}
              onNavigate={closeMobileSidebar}
            />
          ))}
        </nav>

        {/* Collapse Button */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-secondary py-2 text-sm font-medium text-secondary-foreground hover:opacity-90"
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  collapsed,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  const isActive =
    pathname === href ||
    (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2",
        "text-sm font-medium transition-colors",

        collapsed
          ? "md:justify-center"
          : "",

        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      ].join(" ")}
    >
      <span
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",

          isActive
            ? "bg-sidebar-primary-foreground/20"
            : "bg-sidebar-accent text-sidebar-accent-foreground",
        ].join(" ")}
      >
        <Icon className="h-4 w-4" />
      </span>

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </Link>
  );
}