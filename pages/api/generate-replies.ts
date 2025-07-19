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
    // Fetch posts from DB
    const { data: posts, error } = await supabase
      .from("reddit_posts")
      .select("*");
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
