import cron from "node-cron";
import { agentOrchestrator } from "../services/agentOrchestrator";

async function main() {
  console.log("Agent started at", new Date().toISOString());
  try {
    const result = await agentOrchestrator();
    console.log("Agent run result:", result);
  } catch (err) {
    console.error("Agent error:", err);
  }
}

// Schedule to run every 5 minutes
cron.schedule("*/5 * * * *", main);

// Run once on start
main();
