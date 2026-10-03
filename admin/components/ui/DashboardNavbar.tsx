/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
// import { useSession } from "@/context/AuthContext";
// import { getProfileImageUrl } from "./navbar";

export function DashboardNavbar() {
  const { user, logout } = useSession();

  console.log("User in DashboardNavbar:", user);

  if (!user) return null;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: any) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "ST";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none  rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all">
        <Avatar className="h-9 w-9 border border-border cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src={getProfileImageUrl(user.image||"")} alt={user.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56  mt-1">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex flex-col space-y-1.5">
            <p className="text-sm font-semibold leading-none text-foreground">
              {user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="p-2 cursor-pointer">
          <Link href="/profile" className="flex items-center w-full">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="p-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
