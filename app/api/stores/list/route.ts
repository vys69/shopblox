import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        user: {
          select: {
            username: true,
            picture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // If no stores exist, return a specific response
    if (!stores || stores.length === 0) {
      return NextResponse.json(
        { 
          stores: [],
          message: "No stores found" 
        },
        { status: 404 }
      );
    }

    const formattedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      groupId: store.groupId,
      createdAt: store.createdAt,
      owner: {
        username: store.user.username,
        picture: store.user.picture,
      },
    }));

    return NextResponse.json({ stores: formattedStores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
} 