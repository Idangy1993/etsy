import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientId = process.env.ETSY_CLIENT_ID;
  const clientSecret = process.env.ETSY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error:
        "Missing ETSY_CLIENT_ID or ETSY_CLIENT_SECRET environment variables",
    });
  }

  try {
    // Test the credentials by trying to get a shop
    const testResponse = await fetch(
      `https://openapi.etsy.com/v3/application/shops?shop_name=StraightBackwards`,
      {
        headers: {
          "x-api-key": clientId,
          "Content-Type": "application/json",
        },
      }
    );

    if (testResponse.ok) {
      const data = await testResponse.json();
      res.status(200).json({
        success: true,
        message: "Credentials are working!",
        shopFound: data.results && data.results.length > 0,
        shopId: data.results?.[0]?.shop_id,
      });
    } else {
      const errorText = await testResponse.text();
      res.status(500).json({
        error: "Credentials test failed",
        details: errorText,
        status: testResponse.status,
      });
    }
  } catch (error) {
    console.error("Credentials test error:", error);
    res.status(500).json({
      error: "Failed to test credentials",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
