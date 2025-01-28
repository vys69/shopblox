import { validateRequest } from "@/lib/auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

async function getRobloxAuthTicket(cookie: string) {
  // 1. First get CSRF token
  const csrfResponse = await fetch('https://auth.roblox.com/v1/authentication-ticket', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'Content-Type': 'application/json',
      'Referer': 'https://www.roblox.com'
    }
  });
  
  const csrfToken = csrfResponse.headers.get('x-csrf-token');
  if (!csrfToken) {
    throw new Error('Failed to get CSRF token');
  }

  // 2. Get auth ticket using CSRF token
  const ticketResponse = await fetch('https://auth.roblox.com/v1/authentication-ticket', {
    method: 'POST',
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'Content-Type': 'application/json',
      'Referer': 'https://www.roblox.com',
      'X-CSRF-TOKEN': csrfToken
    }
  });

  const authTicket = ticketResponse.headers.get('rbx-authentication-ticket');
  if (!authTicket) {
    throw new Error('Failed to get authentication ticket');
  }

  return { csrfToken, authTicket };
}

async function makeRobloxRequest(url: string, cookie: string, options: RequestInit = {}) {
  // Get auth credentials if this is a POST request
  let headers: Record<string, string> = {
    'Cookie': `.ROBLOSECURITY=${cookie}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Referer': 'https://www.roblox.com'
  };

  if (options.method === 'POST') {
    const { csrfToken, authTicket } = await getRobloxAuthTicket(cookie);
    headers = {
      ...headers,
      'X-CSRF-TOKEN': csrfToken,
      'RBX-Authentication-Ticket': authTicket
    };
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error(`Invalid JSON response: ${text.slice(0, 100)}...`);
  }

  // Return both success and failure responses
  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      data
    };
  }

  return {
    success: true,
    status: response.status,
    data
  };
}

export async function GET(
  request: Request,
  { params }: { params: { endpoint: string } }
) {
  try {
    // Validate user session
    const { session, user } = await validateRequest();
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user's .ROBLOSECURITY token
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { roblosecurity: true }
    });

    if (!dbUser?.roblosecurity) {
      return NextResponse.json(
        { error: "No .ROBLOSECURITY token found" },
        { status: 400 }
      );
    }

    // Handle different endpoints
    switch (params.endpoint) {
      case 'user':
        const userResponse = await makeRobloxRequest(
          'https://users.roblox.com/v1/users/authenticated',
          dbUser.roblosecurity
        );
        return NextResponse.json(userResponse);

      case 'product':
        const productResponse = await makeRobloxRequest(
          'https://economy.roblox.com/v2/assets/106985924314938/details',
          dbUser.roblosecurity
        );
        return NextResponse.json(productResponse);

      case 'purchase':
        // First get product info
        const productInfo = await makeRobloxRequest(
          'https://economy.roblox.com/v2/assets/106985924314938/details',
          dbUser.roblosecurity
        );

        if (!productInfo.success) {
          return NextResponse.json(productInfo);
        }

        // Then attempt purchase with correct details
        const purchaseResponse = await makeRobloxRequest(
          'https://economy.roblox.com/v1/purchases/products/106985924314938',
          dbUser.roblosecurity,
          {
            method: 'POST',
            body: JSON.stringify({
              expectedCurrency: 1,
              expectedPrice: productInfo.data.price,
              expectedSellerId: productInfo.data.creatorTargetId,
              saleLocationId: "2",
              saleLocationType: "Website"
            })
          }
        );
        return NextResponse.json(purchaseResponse);

      default:
        return NextResponse.json(
          { error: "Invalid endpoint" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Debug request failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Request failed"
      },
      { status: 500 }
    );
  }
} 