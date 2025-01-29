"use client";

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CircleUser, Link, Search } from "lucide-react";
import { useUser } from "@/lib/hooks";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, loading } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Redirect if user is logged in
  useEffect(() => {
    if (loading) return; // Wait for loading to finish
    if (user) {
      // redirect("/dashboard");
    }
  }, [loading, user]); // Run effect when loading or user changes

  const handleSearch = async (term: string) => {
    if (term.trim() === "") {
      setSearchResults([]); // Clear results if the search term is empty
      return;
    }

    const response = await fetch(
      `/api/search/stores?keyword=${encodeURIComponent(term)}`,
    );
    const data = await response.json();
    setSearchResults(data);
  };

  // Effect to trigger search on searchTerm change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300); // Debounce for 300ms

    return () => clearTimeout(delayDebounceFn); // Cleanup on unmount
  }, [searchTerm]); // Run effect when searchTerm changes

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  return (
    <div
      className="h-screen bg-black flex flex-col items-center justify-center p-4 space-y-4"
      style={{ height: "calc(100vh - var(--header-height))" }}
    >
      <div className="w-full text-center p-8 border border-zinc-900 shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-300 mb-4">
          welcome to shopblox
        </h1>
        <p className="text-zinc-400 mb-8">
          create your own roblox store and start selling today
        </p>
        <form action="/login/roblox" className="space-y-4">
          <Button
            className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition-colors rounded-none"
            size="lg"
          >
            <CircleUser className="mr-2 h-5 w-5" />
            login with roblox
          </Button>
        </form>
      </div>
      <div className="w-full text-center p-8 border border-zinc-900 shadow-lg">
        <h1 className="text-3xl font-bold text-zinc-300 mb-4">not a seller?</h1>
        <div className="text-zinc-400 mt-4">
          <Input
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 transition-colors mt-2 rounded-none"
            placeholder="search for a store"
          />
          <div className="border border-zinc-900 shadow-lg bg-black">
            <ul className="text-zinc-400">
              {searchResults.map((item: any) => (
                <li
                  className="text-zinc-400 p-4 border-b border-zinc-900"
                  key={item.slug}
                >
                  {item.name} [/{item.slug}]
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
