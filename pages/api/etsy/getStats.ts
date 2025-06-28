// pages/api/etsy/getstats.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { getShopStats } from "../../../lib/etsy";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = process.env.ETSY_API_TOKEN!;
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
    const stats = await getShopStats(shopId, token);
    res.status(200).json(stats);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Etsy stats fetch error:", err.message);
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
