import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the import based on your setup
import { validateRequest } from "@/lib/auth"; // Import your authentication validation
import { Store } from "@/index"; // Import the Store type

async function fetchRobloxProducts(
  groupId: string,
  retries: number = 3,
): Promise<any> {
  const response = await fetch(
    `https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=${groupId}`,
  );
  const data = await response.json();

  // Check for rate limiting
  if (
    data.errors &&
    data.errors.some((error: any) => error.message === "Too many requests")
  ) {
    if (retries > 0) {
      console.warn("Rate limit hit, retrying...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
      return fetchRobloxProducts(groupId, retries - 1); // Retry the request
    } else {
      throw new Error("Rate limit exceeded, please try again later.");
    }
  }

  return data;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  const { slug } = params;

  try {
    // Fetch the store from the database using the slug
    const store: Store | null = await prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Fetch Roblox products using the groupId from the store
    const productsData = await fetchRobloxProducts(store.groupId);

    // Return the store and the fetched products
    return NextResponse.json(
      { store, products: productsData.data || [] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching store and products:", error);
    return NextResponse.json(
      { error: "Failed to fetch store and products" },
      { status: 500 },
    );
  }
}
