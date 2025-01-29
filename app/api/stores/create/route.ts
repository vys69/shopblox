import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { session, user } = await validateRequest();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Return unauthorized if no session
  }

  // Get user with roblosecurity status
  const dbUser = await prisma.user.upsert({
    where: { id: user.id },
    update: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      picture: user.picture,
    },
    create: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      picture: user.picture,
    },
  });

  if (!dbUser) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      ...dbUser,
    },
  });
}

export async function POST(request: Request) {
  const { userId, groupId, name, slug } = await request.json();

  try {
    // Create the store in the database
    const store = await prisma.store.create({
      data: {
        userId,
        groupId,
        name,
        slug,
      },
    });

    // Update the user's isSeller status
    await prisma.user.update({
      where: { id: userId },
      data: { isSeller: true },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Error creating store or updating user:", error);
    return NextResponse.json(
      { error: "Failed to create store or update user" },
      { status: 500 },
    );
  }
}
