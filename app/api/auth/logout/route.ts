import { validateRequest, lucia, oauth2Client } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return redirect("/");
    }

    // Invalidate the session
    await lucia.invalidateSession(session.id);

    // Clear the session cookie
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    // Clear the Roblox cookie
    cookies().delete(".ROBLOSECURITY");

    return redirect("/");
  } catch (error) {
    console.error("Logout error:", error);
    return redirect("/");
  }
} 