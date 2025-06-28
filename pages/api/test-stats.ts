import type { NextApiRequest, NextApiResponse } from "next";
import { getActiveListings } from "@/lib/etsy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const shopId = process.env.ETSY_SHOP_ID;
  const token = process.env.ETSY_ACCESS_TOKEN;

  if (!shopId) {
    return res.status(500).json({
      error: "Missing ETSY_SHOP_ID environment variable",
    });
  }

  if (!token) {
    return res.status(500).json({
      error:
        "Missing ETSY_ACCESS_TOKEN environment variable. Please add your OAuth access token to .env.local",
    });
  }

  try {
    const listings = await getActiveListings(shopId, token);
    res.status(200).json(listings);
  } catch (error) {
    console.error("Etsy API error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
