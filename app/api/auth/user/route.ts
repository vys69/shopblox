import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { session, user } = await validateRequest();

  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Get user with roblosecurity status
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      username: true,
      nickname: true,
      picture: true,
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
