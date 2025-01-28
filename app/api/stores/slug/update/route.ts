import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import based on your setup
import { validateRequest } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: { slug: string, userId: string, groupId: string } }) {
    const { slug } = await request.json();
    const userId = params.userId;
    const groupId = params.groupId;
    const { session } = await validateRequest();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const updatedStore = await prisma.store.updateMany({
            where: {
                userId: userId,
                groupId: groupId,
            },
            data: {
                slug,
            },
        });

        return NextResponse.json(updatedStore, { status: 200 });
    } catch (error) {
        console.error("Error updating slug:", error);
        return NextResponse.json({ error: "Failed to update slug" }, { status: 500 });
    }
} 