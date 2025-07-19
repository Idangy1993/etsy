/**
 * API endpoint for fetching and processing Reddit posts
 * Triggers the full pipeline: fetch, filter, rank, and save
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { fetchAndProcessPosts } from "@/pages/api/postPipeline";
import { logger } from "@/lib/logger";
import { supabase } from "@/lib/supabaseClient";
import { validateEnvVars } from "@/lib/serverUtils";

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
  console.log(
    "[fetch-posts] OPENAI_API_KEY:",
    process.env.OPENAI_API_KEY ? "set" : "NOT SET"
  );
  // Log Reddit env vars
  const redditVars = [
    "REDDIT_CLIENT_ID",
    "REDDIT_CLIENT_SECRET",
    "REDDIT_USERNAME",
    "REDDIT_PASSWORD",
  ];
  const missingReddit = validateEnvVars(redditVars);
  if (missingReddit.length > 0) {
    console.error("[fetch-posts] MISSING Reddit env vars:", missingReddit);
  } else {
    console.log("[fetch-posts] All Reddit env vars set");
  }
  // Log OpenAI env var
  if (!process.env.OPENAI_API_KEY) {
    console.error("[fetch-posts] MISSING OpenAI env var: OPENAI_API_KEY");
  }
  if (req.method !== "POST") {
    console.log("[fetch-posts] 405 Method Not Allowed");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    console.log("[fetch-posts] Starting fetchAndProcessPosts");
    const result = await fetchAndProcessPosts();
    // Generate a new batch_id (timestamp)
    const batchId = Date.now().toString();
    // Get all existing post URLs
    const { data: existingPosts, error: fetchError } = await supabase
      .from("reddit_posts")
      .select("url");
    if (fetchError)
      throw new Error("Failed to fetch existing posts: " + fetchError.message);
    const existingUrls = new Set((existingPosts || []).map((p: any) => p.url));
    // Filter out posts with URLs already in the DB
    const newPosts = (result.topRanked || []).filter(
      (post: any) => !existingUrls.has(post.url)
    );
    // Add batch_id to each new post
    const postsToInsert = newPosts.map((post: any) => ({
      ...post,
      batch_id: batchId,
    }));
    // Insert new posts for this batch
    if (postsToInsert.length > 0) {
      const { error } = await supabase
        .from("reddit_posts")
        .insert(postsToInsert);
      if (error)
        throw new Error("Failed to save posts to DB: " + error.message);
    }
    console.log("[fetch-posts] Success, result:", {
      ...result,
      inserted: postsToInsert.length,
    });
    res.status(200).json({
      message: "Posts pulled, filtered, ranked, and saved successfully",
      ...result,
      inserted: postsToInsert.length,
      batch_id: batchId,
    });
  } catch (error) {
    logger.error("Reddit API error", error);
    console.error("[fetch-posts] Error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
  if (!res.writableEnded) {
    console.error("[fetch-posts] No response sent, sending fallback 500");
    res.status(500).json({ error: "No response sent from handler" });
  }
}
