import type { NextApiRequest, NextApiResponse } from "next";
import { agentOrchestrator } from "@/services/agentOrchestrator";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await agentOrchestrator();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
  }
}
