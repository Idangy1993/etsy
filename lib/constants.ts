/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  REDDIT: {
    USER_AGENT: "straight-backwards-agent",
    SEARCH_LIMIT: 5,
    SEARCH_TIME: "year" as const,
    SEARCH_SORT: "new" as const,
  },
  OPENAI: {
    MODEL: "gpt-4o",
    TEMPERATURE: {
      FILTER: 0,
      GENERATE: 0.8,
      REPLY: 0.7,
    },
  },
  ETSY: {
    DEFAULT_SHOP: "StraightBackwards",
  },
} as const;

// File paths
export const FILE_PATHS = {
  FOUND_POSTS: "data/foundPosts.json",
  GPT_FILTER_DEBUG: "data/gptFilterDebug.json",
  REDDIT_REPLIES: "data/redditReplies.json",
} as const;

// Validation constants
export const VALIDATION = {
  MIN_POST_LENGTH: 20,
  MIN_UPVOTES: 0,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FETCH_FAILED: "Failed to fetch data",
  GENERATION_FAILED: "Failed to generate content",
  INVALID_RESPONSE: "Invalid response from service",
  FILE_READ_ERROR: "Could not read file",
  API_ERROR: "API request failed",
} as const;
