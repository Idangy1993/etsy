// pages/api/generate-replies.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import type { RedditPost } from "@/lib/filterPosts";
import { generateRepliesForPosts } from "@/lib/gptReplyGenerator";
import { FILE_PATHS } from "@/lib/constants";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const filePath = FILE_PATHS.FOUND_POSTS;
    const raw = fs.readFileSync(filePath, "utf8");
    const posts: RedditPost[] = JSON.parse(raw);

    const replies = await generateRepliesForPosts(posts);

    const updated = posts.map((post, i) => ({
      ...post,
      reply: replies[i] || "",
    }));

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));

    res.status(200).json({
      message: "Replies generated and saved successfully",
      count: updated.length,
    });
  } catch (err) {
    console.error("❌ Failed to generate replies:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
