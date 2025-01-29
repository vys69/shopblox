import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import based on your setup
import { validateRequest } from "@/lib/auth";

export async function GET(request: Request) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const groupId = searchParams.get("groupId");

  if (!userId || !groupId) {
    return NextResponse.json(
      { error: "Missing userId or groupId" },
      { status: 400 },
    );
  }

  try {
    const existingStore = await prisma.store.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });

    return NextResponse.json(existingStore || null); // Return existing store or null if not found
  } catch (error) {
    console.error("Error checking existing store:", error);
    return NextResponse.json(
      { error: "Failed to check existing store" },
      { status: 500 },
    );
  }
}
