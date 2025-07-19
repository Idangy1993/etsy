/**
 * Server-only utility functions (Node.js specific)
 */

import fs from "fs";
import path from "path";
import { FILE_PATHS } from "./constants";

/**
 * Safely read JSON file with error handling
 */
export function readJsonFile<T>(filePath: string): T | null {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
}

/**
 * Safely write JSON file with error handling
 */
export function writeJsonFile<T>(filePath: string, data: T): boolean {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("[writeJsonFile] Error writing file:", filePath, error);
    return false;
  }
}

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
