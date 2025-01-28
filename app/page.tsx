"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useUser } from "@/lib/hooks";

export default function Home() {
  const { user, loading } = useUser();
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 border border-zinc-900 shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-300 mb-4">
          welcome to shopblox
        </h1>
        <p className="text-zinc-400 mb-8">
          create your own roblox store and start selling today
        </p>
        <form action="/login/roblox" className="space-y-4">
          <Button 
            className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition-colors"
            size="lg"
          >
            <CircleUser className="mr-2 h-5 w-5" />
            login with roblox
          </Button>
        </form>
      </div>
    </main>
  );
}