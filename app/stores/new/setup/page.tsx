"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const SlugSetupPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [slug, setSlug] = useState("");
  const userId = searchParams.get("userId");
  const groupId = searchParams.get("groupId");
  const name = searchParams.get("name");

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/stores/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          groupId,
          name,
          slug,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create store");
      }

      // Redirect to the store page or show a success message
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating slug:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-zinc-300">
        Choose Your Store URL
      </h1>
      <p className="text-zinc-400">
        Select a unique slug for your awesome group store:
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="flex items-center">
          <span className="text-zinc-300">shopblox.com/store/</span>
          <input
            type="text"
            value={slug}
            onChange={handleSlugChange}
            placeholder="your-store-slug"
            className="ml-2 p-2 border border-zinc-900 rounded text-zinc-300 bg-zinc-900"
          />
        </div>
        <Button type="submit" className="mt-4">
          Continue
        </Button>
      </form>
    </div>
  );
};

const SlugSetupPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SlugSetupPage />
  </Suspense>
);

export default SlugSetupPageWrapper;
