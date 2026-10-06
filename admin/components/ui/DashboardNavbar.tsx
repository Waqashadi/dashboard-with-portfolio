"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardNavbar() {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) {
    return <span className="size-9 animate-pulse rounded-full bg-muted" aria-label="Loading account" />;
  }

  const displayName = user.name?.trim() || user.email || "User";
  const initials = displayName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger aria-label={`Open account menu for ${displayName}`} className="rounded-full outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Avatar className="size-9 cursor-pointer border border-border transition-opacity hover:opacity-80">
          <AvatarImage
            src={user.image ?? undefined}
            alt={`${displayName} avatar`}
          />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-2 w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-3 font-normal">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-semibold leading-none text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          render={<Link href="/dashboard/profile" />}
          className="cursor-pointer rounded-lg p-2"
        >
          <User className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="cursor-pointer rounded-lg p-2 text-destructive focus:bg-destructive/5 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
