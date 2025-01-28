// app/stores/new/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks"; // Import the useUser hook
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Verified, VerifiedIcon } from "lucide-react";
import GroupCard from "@/components/groups/GroupCard";
import { useRouter } from "next/navigation";

// Define the type for a group
interface Group {
    path: string;
    createTime: string;
    updateTime: string;
    id: string;
    displayName: string;
    description: string;
    owner: string;
    memberCount: number;
    publicEntryAllowed: boolean;
    locked: boolean;
    verified: boolean;
}

interface User {
    username: string;
    picture: string;
}

export default function NewStorePage() {
    const { user, loading, error } = useUser(); // Get user data from the hook
    const [groupId, setGroupId] = useState(""); // State for group ID input
    const [groupData, setGroupData] = useState<Group | null>(null); // State for fetched group data
    const [ownerAvatarUrl, setOwnerAvatarUrl] = useState(""); // State for owner's avatar URL
    const [fetchError, setFetchError] = useState(""); // State for fetch error
    const [formSubmitted, setFormSubmitted] = useState(false); // State to track form submission
    const router = useRouter();

    const handleGroupIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupId(e.target.value); // Update group ID state
    };

    const fetchUserImage = async (userId: string) => {
        try {
            const response = await fetch(`/api/users?userId=${userId}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user image");
            }

            const data = await response.json();
            console.log("user image data", data);
            console.log("user image data thumbnailUri", data.response.imageUri);
            return data.response.imageUri; // Adjust based on the actual response structure
        } catch (error) {
            console.error("Error fetching user image:", error);
            return null; // Return null if there's an error
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setFormSubmitted(true); // Mark the form as submitted

        try {
            const response = await fetch(`/api/stores?groupId=${groupId}`, {
                method: "GET",
            });

            const data = await response.json();

            setGroupData(data); // Set the fetched group data
            setFetchError(""); // Clear any previous errors

            const ownerId = data.owner;
            const ownerUserId = ownerId.split("/").pop();
            // Fetch the owner's avatar image
            const avatarUrl = await fetchUserImage(ownerUserId);
            setOwnerAvatarUrl(avatarUrl); // Set the owner's avatar URL

            // Check if group data exists and if the user is the owner
            if (data && !isUserOwner()) {
                setGroupId(""); // Clear the input box if the user is not the owner
            }

        } catch (error) {
            console.error("Error fetching group data:", error);
            setFetchError("Error fetching group data.");
        }
    };

    const handleAddStore = async () => {
        if (!groupData) return; // Ensure groupData is available

        try {
            // Check if the store already exists using the new API route
            const checkResponse = await fetch(`/api/stores/check?userId=${user?.id}&groupId=${groupData.id}`, {
                method: "GET",
            });

            if (!checkResponse.ok) {
                throw new Error("Failed to check existing store");
            }

            const existingStore = await checkResponse.json();
            console.log("Existing Store:", existingStore); // Log the existing store

            if (existingStore) {
                console.error("Store already exists for this user and group.");
                alert("You have already created a store for this group.");
                return; // Exit the function if the store already exists
            }

            // Redirect to the slug setup page with user and group data
            router.push(`/stores/new/setup?userId=${user?.id}&groupId=${groupData.id}`); // Adjust the path as needed

        } catch (error) {
            console.error("Error adding store:", error);
        }
    };

    const handleNoClick = () => {
       setGroupId("");
    };

    const isUserOwner = () => {
        if (user && groupData) {
            const ownerId = groupData.owner.split("/").pop(); // Extract the owner ID from the group data
            return ownerId === user.id; // Compare with the logged-in user's ID
        }
        return false; // Return false if user or groupData is not available
    };

    if (loading) return <p>Loading...</p>; // Show loading state
    if (error) return <p>Error loading user data: {error}</p>; // Show error state

    return (
        <div className="min-h-screen bg-black p-4 flex flex-col items-center justify-center">
            {user && (
                <div className="text-center p-8 border border-zinc-900 shadow-lg">
                    <h2 className="text-3xl font-extrabold text-zinc-300 mt-2 mb-4">welcome, {user.username}!</h2>
                    <img src={user.picture || "/placeholder.svg"} alt={user.username} className="w-24 h-24 mx-auto mb-4 rounded-full" />
                    <p className="mb-8 text-zinc-400">enter the id of the group you want to list on shopblox:</p>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={groupId} onChange={handleGroupIdChange} placeholder="Group ID" className="w-full p-2 mb-4 border border-zinc-900 rounded-none text-zinc-300 bg-zinc-900" />
                        <button type="submit" className="w-full p-2 bg-zinc-900 text-zinc-300 border border-zinc-800 shadow-md hover:bg-zinc-800 transition-colors">Submit</button>
                    </form>

                    {fetchError && <p className="text-red-500">{fetchError}</p>}

                    {groupData && isUserOwner() && (
                        <div className="space-y-4">
                            <h1 className="text-2xl font-bold text-zinc-300 mt-4">Is this your group?</h1>
                            <GroupCard groupData={groupData} ownerAvatarUrl={ownerAvatarUrl} />
                            <div className="flex justify-between w-full">
                                <Button 
                                    className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none"
                                    onClick={handleAddStore}
                                >
                                    Yes
                                </Button>
                                <Button className="w-full bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 rounded-none">No</Button>
                            </div>
                        </div>
                    )}

                    {groupData && !isUserOwner() && formSubmitted && (
                        <div className="space-y-4">
                            <Card className="text-center p-8 border border-zinc-900 shadow-lg bg-zinc-900 border-zinc-800 mt-4 rounded-none">
                                <CardHeader>
                                    <CardTitle className="text-zinc-300 font-normal">
                                        You are not the owner of
                                        <p className="p-4 text-zinc-300 font-normal italic">{groupData?.displayName}</p>
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}