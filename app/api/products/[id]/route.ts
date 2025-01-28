import { NextResponse } from "next/server";

async function fetchProductThumbnail(id: string) {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error(`Thumbnail API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data[0]?.imageUrl || null;
  } catch (error) {
    console.error("Error fetching thumbnail:", error);
    return null;
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Use the v2 search/items endpoint instead
    const response = await fetch(
      `https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=35426951`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Roblox API error: ${response.status}`);
    }

    const { data } = await response.json();
    
    // Find the specific product
    const productData = data.find((item: any) => item.id.toString() === params.id);

    if (!productData) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch thumbnail
    const thumbnailUrl = await fetchProductThumbnail(params.id);

    // Combine the data
    const product = {
      ...productData,
      thumbnailUrl: thumbnailUrl || "/placeholder-product.png",
    };

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 