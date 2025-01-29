"use client";

import { Sparkles, ChevronDown, User, LogOut } from "lucide-react";
import ModeToggle from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/hooks";

export default function NavigationMenu() {
  const { user, loading } = useUser();

  return (
    <div className="sticky top-0 py-6 w-full px-10 border-b border-zinc-900 bg-black z-50">
      <nav className="flex items-center gap-x-10">
        <Link href={"/"}>
          <div className="flex items-center gap-x-4">
            <h1 className="text-2xl text-zinc-300 font-bold">shopblox</h1>
          </div>
        </Link>

        <div className="flex items-center gap-x-4">
          <Link href={"/"}>
            <h1 className="text-zinc-400 font-medium">stores</h1>
          </Link>

        {user && user.stores && user.stores.length > 0 && (
          <Link href={"/"}>
            <h1 className="text-zinc-400 font-medium">my stores</h1>
          </Link>
        )}
        </div>

        <div className="flex items-center ml-auto gap-x-4">
          {!loading ? (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        {user.picture && (
                          <AvatarImage src={user.picture} alt={user.username || ''} />
                        )}
                        <AvatarFallback>
                          {user.username?.slice(0, 2).toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-black border border-zinc-900 rounded-none">
                    <DropdownMenuItem asChild className="bg-black hover:bg-zinc-900">
                      <Link href={`/profiles/${user.username}`} className="flex items-center text-zinc-400">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="bg-black hover:bg-zinc-900">
                      <ModeToggle className="bg-black hover:bg-zinc-900 rounded-none text-zinc-400 fill-zinc-400 hover:fill-zinc-300" />
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="bg-black hover:bg-zinc-900">
                      <form action="/api/auth/logout" method="POST" className="w-full bg-black hover:bg-zinc-900">
                        <button className="flex w-full items-center text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login/roblox">
                  <Button>Sign in</Button>
                </Link>
              )}
            </>
          ) : (
            <Button variant="ghost" className="relative h-10 w-10 rounded-full" disabled>
              <Avatar className="h-10 w-10 bg-zinc-900">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
} 