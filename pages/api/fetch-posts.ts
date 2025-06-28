/**
 * API endpoint for fetching and processing Reddit posts
 * Triggers the full pipeline: fetch, filter, rank, and save
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAndProcessPosts } from "@/pages/api/postPipeline";
import { logger } from "@/lib/logger";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  if (_req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const result = await fetchAndProcessPosts();

    res.status(200).json({
      message: "Posts pulled, filtered, ranked, and saved successfully",
      ...result,
    });
  } catch (error) {
    logger.error("Reddit API error", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
