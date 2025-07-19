// pages/api/generate-replies.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generateRepliesService } from "@/services/generateRepliesService";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await generateRepliesService();
    res.status(200).json(result);
  } catch (err) {
    console.error("❌ Failed to generate replies:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
