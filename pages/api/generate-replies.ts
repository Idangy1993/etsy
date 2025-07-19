// pages/api/generate-replies.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabaseClient";
import type { RedditPost } from "@/lib/filterPosts";
import { generateRepliesForPosts } from "@/lib/gptReplyGenerator";

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
    if (batchError) throw batchError;
    const latestBatchId = latestBatch?.[0]?.batch_id;
    if (!latestBatchId) {
      return res
        .status(200)
        .json({ message: "No posts to generate replies for", count: 0 });
    }
    // Fetch posts from the latest batch
    const { data: posts, error } = await supabase
      .from("reddit_posts")
      .select("*")
      .eq("batch_id", latestBatchId);
    if (error) throw error;
    if (!posts || posts.length === 0) {
      return res
        .status(200)
        .json({ message: "No posts to generate replies for", count: 0 });
    }
    const replies = await generateRepliesForPosts(posts);
    // Update each post with its reply
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const reply = replies[i] || "";
      await supabase.from("reddit_posts").update({ reply }).eq("id", post.id);
    }
    res
      .status(200)
      .json({
        message: "Replies generated and saved successfully",
        count: posts.length,
      });
  } catch (err) {
    console.error("❌ Failed to generate replies:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
