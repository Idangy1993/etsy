import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code received" });
  }

  const clientId = process.env.ETSY_CLIENT_ID;
  const clientSecret = process.env.ETSY_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/api/etsy/callback";

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error:
        "Missing ETSY_CLIENT_ID or ETSY_CLIENT_SECRET environment variables",
    });
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://api.etsy.com/v3/public/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          redirect_uri: redirectUri,
          code: code as string,
          code_verifier: "", // PKCE not required for this flow
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return res.status(500).json({
        error: "Failed to exchange authorization code for access token",
        details: errorText,
      });
    }

    const tokenData = await tokenResponse.json();

    // Return the access token (in production, you'd store this securely)
    res.status(200).json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      message: "Add this access_token to your .env.local as ETSY_ACCESS_TOKEN",
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({
      error: "Failed to complete OAuth flow",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
