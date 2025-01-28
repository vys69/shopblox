import { oauth2Client } from "@/lib/auth";

export async function GET(): Promise<Response> {
  const url = await oauth2Client.createAuthorizationURL({
    scopes: [
      // Basic scopes
      "openid",
      "profile",
      "group:read",
      "user.advanced:read",
      "user.social:read",
    ],
  });

  return Response.redirect(url);
}
