import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { lucia, oauth2Client } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, error: "No code provided" },
        { status: 400 },
      );
    }

    // Exchange code for token
    const tokenResponse = await fetch(
      "https://apis.roblox.com/oauth/v1/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.REDIRECT_URI!,
        }),
      },
    );

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status}`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info using the access token
    const userResponse = await fetch(
      "https://apis.roblox.com/oauth/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      },
    );

    if (!userResponse.ok) {
      throw new Error(`User info failed: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    // Create or update user with access token
    const user = await prisma.user.upsert({
      where: { id: userData.sub },
      create: {
        id: userData.sub,
        username: userData.preferred_username,
        nickname: userData.nickname,
        picture: userData.picture,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
      update: {
        username: userData.preferred_username,
        nickname: userData.nickname,
        picture: userData.picture,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
      },
    });

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("OAuth Error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
