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
  const userId = searchParams.get("userId"); // Get userId from query parameters

  try {
    // Fetch user data from the Roblox API
    const response = await fetch(
      `https://apis.roblox.com/cloud/v2/users/${userId}:generateThumbnail`,
      {
        method: "GET",
        headers: requestHeaders,
      },
    );

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error response
      console.error("Error fetching user data from Roblox API:", errorData);
      return NextResponse.json(
        { error: "Failed to fetch user data from Roblox API" },
        { status: 500 },
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 }); // Return the user data with a 200 status
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    ); // Return error if fetching fails
  }
}
