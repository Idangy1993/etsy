import type { NextApiRequest, NextApiResponse } from "next";
import { getActiveListings } from "../../../lib/etsy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.ETSY_ACCESS_TOKEN!;
  const shopId = process.env.ETSY_SHOP_ID!;

  if (!token) {
    return res.status(500).json({
      error:
        "ETSY_ACCESS_TOKEN not configured. Please add your OAuth access token to .env.local",
    });
  }

  if (!shopId) {
    return res.status(500).json({
      error:
        "ETSY_SHOP_ID not configured. Please add your shop ID to .env.local",
    });
  }

  try {
    const listings = await getActiveListings(shopId, token);
    res.status(200).json(listings);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Etsy listings fetch error:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
