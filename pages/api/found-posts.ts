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
    const { data, error } = await supabase
      .from("reddit_posts")
      .select("*")
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
