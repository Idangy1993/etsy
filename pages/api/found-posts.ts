/**
 * API endpoint for retrieving found Reddit posts
 * Returns posts that have been filtered and saved
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import { logger } from "@/lib/logger";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Get the latest batch_id
    const { data: latestBatch, error: batchError } = await supabase
      .from("reddit_posts")
      .select("batch_id")
      .order("batch_id", { ascending: false })
      .limit(1);
    if (batchError) {
      return res.status(500).json({ error: batchError.message });
    }
    const latestBatchId = latestBatch?.[0]?.batch_id;
    if (!latestBatchId) {
      return res.status(200).json([]);
    }
    // Get posts from the latest batch
    const { data, error } = await supabase
      .from("reddit_posts")
      .select("*")
      .eq("batch_id", latestBatchId)
      .order("created_utc", { ascending: false });
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json(data || []);
  } catch (error) {
    logger.error("Failed to read found posts", error);
    res.status(500).json({ error: "Could not read found posts from DB" });
  }
}
