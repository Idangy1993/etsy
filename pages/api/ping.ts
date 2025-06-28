import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const apiKey = process.env.ETSY_CLIENT_ID;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing ETSY_CLIENT_ID in env' });
      }

  try {
    const response = await fetch('https://api.etsy.com/v3/application/openapi-ping', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: `Etsy ping failed: ${text}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ error: err.message });
    } else {
      return res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
}
