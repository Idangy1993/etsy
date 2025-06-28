import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { clientId, clientSecret, authCode, codeVerifier } = req.body;

  if (!clientId || !clientSecret || !authCode) {
    return res.status(400).json({
      error: "Missing clientId, clientSecret, or authCode",
    });
  }

  if (!codeVerifier) {
    return res.status(400).json({
      error:
        "Missing codeVerifier. Please use the authorization URL from the OAuth page.",
    });
  }

  // Use the simpler redirect URI that matches the direct OAuth approach
  const redirectUri = "http://localhost:3000";

  try {
    console.log("Attempting token exchange with:", {
      clientId,
      redirectUri,
      authCode: authCode.substring(0, 10) + "...", // Log partial code for debugging
      hasCodeVerifier: !!codeVerifier,
    });

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://api.etsy.com/v3/public/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          code: authCode,
          code_verifier: codeVerifier, // Add the required code_verifier
        }),
      }
    );

    console.log("Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      console.error(
        "Response headers:",
        Object.fromEntries(tokenResponse.headers.entries())
      );

      return res.status(500).json({
        error: "Failed to exchange authorization code for access token",
        details: errorText,
        status: tokenResponse.status,
      });
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful:", {
      hasAccessToken: !!tokenData.access_token,
      expiresIn: tokenData.expires_in,
    });

    // Return the access token
    res.status(200).json({
      success: true,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      message: "Add this access_token to your .env.local as ETSY_ACCESS_TOKEN",
    });
  } catch (error) {
    console.error("Token exchange error:", error);
    res.status(500).json({
      error: "Failed to exchange token",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
