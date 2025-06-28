export async function getActiveListings(shopId: string, apiKey: string) {
  const res = await fetch(
    `https://openapi.etsy.com/v3/application/shops/${shopId}/listings/active`,
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Etsy API error");
  }

  return res.json();
}

export async function getShopStats(shopId: string, token: string) {
  const res = await fetch(
    `https://openapi.etsy.com/v3/application/shops/${shopId}/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Etsy API error");
  }

  return res.json();
}

export async function getShopIdByName(shopName: string, apiKey: string) {
  const res = await fetch(
    `https://openapi.etsy.com/v3/application/shops?shop_name=${shopName}`,
    {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Etsy API error");
  }

  const data = await res.json();
  return data.results?.[0]?.shop_id;
}
