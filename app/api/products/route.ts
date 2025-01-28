import { NextResponse } from 'next/server';

interface RobloxCatalogItem {
  id: number;
  itemType: string;
  name: string;
  description: string;
  price?: number;
  lowestPrice?: number;
  creatorName: string;
  creatorType: string;
  creatorTargetId: number;
}

async function fetchThumbnails(itemIds: number[]) {
  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${itemIds.join(',')}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch thumbnails');
    }

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Thumbnail API Error:', error);
    return [];
  }
}

export async function GET() {
  try {
    const response = await fetch(
      'https://catalog.roblox.com/v2/search/items/details?Category=3&CreatorType=Group&CreatorTargetId=35426951',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 }
      }
    );

    if (!response.ok) {
      throw new Error(`Roblox API error: ${response.status}`);
    }

    const data = await response.json();
    const items = data.data || [];

    // Get thumbnails for all items
    if (items.length > 0) {
      const itemIds = items.map((item: RobloxCatalogItem) => item.id);
      console.log('Fetching thumbnails for IDs:', itemIds);

      const thumbnails = await fetchThumbnails(itemIds);
      console.log('Received thumbnails:', thumbnails);

      // Merge thumbnails with items
      const itemsWithThumbnails = items.map((item: RobloxCatalogItem) => {
        const thumbnail = thumbnails.find((t: any) => t.targetId === item.id);
        console.log(`Matching thumbnail for item ${item.id}:`, thumbnail);
        return {
          ...item,
          thumbnailUrl: thumbnail?.imageUrl || '/placeholder-product.png'
        };
      });

      console.log('Final items with thumbnails:', itemsWithThumbnails);

      return NextResponse.json({
        success: true,
        data: itemsWithThumbnails
      });
    }

    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 