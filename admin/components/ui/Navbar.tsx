"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowUpRight, ChevronDown, GitBranch, LogOut, Menu, UserRound, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/repositories", label: "Repositories" },
  { href: "/skills", label: "Skills" },
  { href: "/activity", label: "Activity" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;
  const displayName = user?.name?.trim() || user?.email || "Account";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const closeMenu = () => setMobileOpen(false);
  const actionLinks = user ? (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        onClick={closeMenu}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Dashboard
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label={`Open account menu for ${displayName}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Avatar className="size-7 border border-border">
            <AvatarImage src={user.image ?? undefined} alt="" />
            <AvatarFallback className="bg-secondary text-[10px] text-secondary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate sm:inline">{displayName}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mt-2 w-60">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <span className="block truncate text-sm font-medium text-foreground">{displayName}</span>
              {user.email && <span className="mt-1 block truncate text-xs text-muted-foreground">{user.email}</span>}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/dashboard/profile" />} onClick={closeMenu} className="cursor-pointer rounded-lg">
            <UserRound className="mr-2 size-4" /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/" })} className="cursor-pointer rounded-lg text-destructive focus:text-destructive">
            <LogOut className="mr-2 size-4" /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : status === "loading" ? (
    <span className="h-10 w-24 animate-pulse rounded-full bg-muted" aria-label="Loading account" />
  ) : (
    <>
      <Link
        href="/login"
        onClick={closeMenu}
        className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Log in
      </Link>
      <Link
        href="/sign-up"
        onClick={closeMenu}
        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground"
          onClick={closeMenu}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
            <GitBranch className="size-[18px]" aria-hidden="true" />
          </span>
          <span>Waqas HaDi<span className="text-primary">.</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : href === "/#about"
                  ? false
                  : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                  active
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">{actionLinks}</div>
        <button
          type="button"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground lg:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 shadow-lg shadow-foreground/[0.04] lg:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={`rounded-xl px-3 py-3 text-sm font-medium ${
                  (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)) ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              {actionLinks}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
