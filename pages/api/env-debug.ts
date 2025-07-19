import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.json({
    MY_SUPABASE_URL: process.env.MY_SUPABASE_URL,
    MY_SUPABASE_SERVICE_ROLE_KEY: process.env.MY_SUPABASE_SERVICE_ROLE_KEY,
    ALL_ENV: Object.keys(process.env),
  });
}
