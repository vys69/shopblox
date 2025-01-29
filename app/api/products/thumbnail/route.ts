import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  try {
    const response = await fetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&returnPolicy=PlaceHolder&size=420x420&format=Png&isCircular=false`);
    
    if (!response.ok) {
      const errorText = await response.text(); // Log the raw response for debugging
      console.error('Error fetching thumbnail:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch thumbnail' });
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return res.status(200).json({ thumbnailUrl: data.data[0].imageUrl });
    } else {
      return res.status(404).json({ error: 'Thumbnail not found' });
    }
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 