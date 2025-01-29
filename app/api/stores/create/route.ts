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
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupId, slug } = await request.json();

    // Fetch group details from Roblox API
    const groupResponse = await fetch(`https://groups.roblox.com/v1/groups/${groupId}`);
    if (!groupResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch group details" },
        { status: 400 }
      );
    }
    
    const groupData = await groupResponse.json();
    const name = groupData.name;

    // Create the store with the group name
    const store = await prisma.store.create({
      data: {
        groupId,
        name,    // Use the group name from Roblox
        slug,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
