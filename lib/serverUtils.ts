/**
 * Server-only utility functions (Node.js specific)
 */

import fs from "fs";
import path from "path";
import { FILE_PATHS } from "./constants";

// Remove readJsonFile and writeJsonFile, now using DB for posts/replies

/**
 * Validate required environment variables
 */
export function validateEnvVars(required: string[]): string[] {
  const missing: string[] = [];

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  return missing;
}

/**
 * Create Reddit client with validation
 */
export function createRedditClient() {
  const requiredVars = [
    "REDDIT_CLIENT_ID",
    "REDDIT_CLIENT_SECRET",
    "REDDIT_USERNAME",
    "REDDIT_PASSWORD",
  ];

  const missing = validateEnvVars(requiredVars);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Import here to avoid issues with SSR
  const Snoowrap = require("snoowrap");

  return new Snoowrap({
    userAgent: "straight-backwards-agent",
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });
}

/**
 * Create OpenAI client with validation
 */
export function createOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const OpenAI = require("openai");
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
