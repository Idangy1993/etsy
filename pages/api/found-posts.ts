/**
 * API endpoint for retrieving found Reddit posts
 * Returns posts that have been filtered and saved
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { readJsonFile } from "@/lib/serverUtils";
import { FILE_PATHS } from "@/lib/constants";
import { logger } from "@/lib/logger";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = readJsonFile(FILE_PATHS.FOUND_POSTS);

    if (!data) {
      return res.status(200).json([]);
    }

    res.status(200).json(data);
  } catch (error) {
    logger.error("Failed to read found posts", error);
    res.status(500).json({ error: "Could not read found posts file" });
  }
}
