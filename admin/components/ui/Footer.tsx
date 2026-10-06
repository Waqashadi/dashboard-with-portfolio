"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ArrowUpRight, GitBranch } from "lucide-react";

const footerLinks = [
  { href: "/repositories", label: "Repositories" },
  { href: "/skills", label: "Skills" },
  { href: "/activity", label: "Activity" },
];

export default function Footer() {
  const { data: session } = useSession();

  return (
    <footer className="mt-auto border-t border-border/70 bg-card/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="size-4 text-primary" aria-hidden="true" />
          Waqas HaDi
        </Link>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <Link href={session?.user ? "/dashboard" : "/login"} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
            {session?.user ? "Dashboard" : "Admin"} <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">Built with care and open-source code.</p>
      </div>
    </footer>
  );
}
