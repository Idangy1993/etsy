/**
 * API endpoint for fetching and processing Reddit posts
 * Triggers the full pipeline: fetch, filter, rank, and save
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAndProcessPosts } from "@/pages/api/postPipeline";
import { logger } from "@/lib/logger";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[fetch-posts] Method:", req.method);
  console.log(
    "[fetch-posts] ETSY_API_TOKEN:",
    process.env.ETSY_API_TOKEN ? "set" : "NOT SET"
  );
  console.log(
    "[fetch-posts] ETSY_SHOP_ID:",
    process.env.ETSY_SHOP_ID ? "set" : "NOT SET"
  );

  if (req.method !== "POST") {
    console.log("[fetch-posts] 405 Method Not Allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await fetchAndProcessPosts();
    console.log("[fetch-posts] Success:", result);
    res.status(200).json({
      message: "Posts pulled, filtered, ranked, and saved successfully",
      ...result,
    });
  } catch (error) {
    logger.error("Reddit API error", error);
    console.error("[fetch-posts] Error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
