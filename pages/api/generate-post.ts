import type { NextApiRequest, NextApiResponse } from "next";
import { generateRedditPost } from "@/lib/gptPostGenerator";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { subreddit } = req.body;
    const post = await generateRedditPost(subreddit);
    res.status(200).json({ post: `${post.title}\n\n${post.body}` });
  } catch (error: unknown) {
    console.error("❌ Post generation failed:", error);
    res.status(500).json({ error: "Failed to generate post" });
  }
}
