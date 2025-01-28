import { NextResponse } from 'next/server';

interface ThumbnailResponse {
  data: Array<{
    targetId: number;
    state: string;
    imageUrl: string;
  }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids');

  if (!ids) {
    return NextResponse.json(
      { success: false, error: 'No item IDs provided' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://thumbnails.roblox.com/v1/assets?assetIds=${ids}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Roblox Thumbnails API error: ${response.status}`);
    }

    const thumbnailData: ThumbnailResponse = await response.json();
    
    return NextResponse.json({
      success: true,
      data: thumbnailData.data
    });
  } catch (error) {
    console.error('Thumbnail API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch thumbnails',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 