/**
 * Client-safe utility functions (browser compatible)
 */

/**
 * Format price from Etsy API response
 */
export function formatPrice(price: {
  amount: number;
  divisor: number;
  currency_code: string;
}): string {
  return `${price.currency_code} ${(price.amount / price.divisor).toFixed(2)}`;
}

/**
 * Clean text for keyword matching
 */
export function cleanTextForSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\s]/g, "")
    .trim();
}
 