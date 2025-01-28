//fetch roblox store items

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { useSearchParams } from "next/navigation";
import React from "react";

export async function GET(request: Request, { params }: { params: { groupId: string } }): Promise<NextResponse> {
    const { user } = await validateRequest();
    const searchParams = useSearchParams();
    const groupId = searchParams.get("groupId");
    if (!groupId) {
        return NextResponse.json({ error: "groupId is required" }, { status: 400 });
    }
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const request = await fetch(`https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=${params.groupId}`);
        const data = await request.json();
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch store items" }, { status: 500 });
    }
}
