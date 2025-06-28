import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.ETSY_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({
      error: "Missing ETSY_CLIENT_ID environment variable",
    });
  }

  // Generate PKCE code verifier and challenge
  const codeVerifier = crypto.randomBytes(32).toString("base64url");
  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  // Use a simpler redirect URI that's more likely to be registered
  const redirectUri = "http://localhost:3000/api/etsy/callback";

  // Etsy OAuth authorization URL with PKCE
  const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=listings_r&client_id=${clientId}&state=random_state_string&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.status(200).json({
    authUrl,
    codeVerifier, // Return the code verifier to be used later
    message:
      "Click the authUrl to complete OAuth flow and get your access token",
    redirectUri: redirectUri,
    note: "Make sure this redirect URI is registered in your Etsy app settings",
  });
}
