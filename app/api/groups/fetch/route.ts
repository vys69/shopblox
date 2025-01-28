import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth"; // Import your authentication validation

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { session, user } = await validateRequest(); // Validate the request and get user info

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Return unauthorized if no session
  }


  const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;

  // set the x-api-key header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-api-key", ROBLOX_API_KEY || "");

  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId"); // Get groupId from query parameters

  if (!groupId) {
    return NextResponse.json({ error: "Group ID is required" }, { status: 400 }); // Return error if groupId is missing
  }

  try {
    // Fetch group data from the Roblox API
    const response = await fetch(`https://apis.roblox.com/cloud/v2/groups/${groupId}`, {
      method: "GET",
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error response
      console.error("Error fetching group data from Roblox API:", errorData);
      return NextResponse.json({ error: "Failed to fetch group data from Roblox API" }, { status: 500 });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 }); // Return the group data with a 200 status
  } catch (error) {
    console.error("Error fetching group data:", error);
    return NextResponse.json({ error: "Failed to fetch group data" }, { status: 500 }); // Return error if fetching fails
  }
}