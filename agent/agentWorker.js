/* eslint-disable @typescript-eslint/no-var-requires */
console.log("=== Agent worker started (deploy test) ===");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cron = require("node-cron");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { agentOrchestrator } = require("../services/agentOrchestrator");

async function main() {
  console.log("Agent started at", new Date().toISOString());
  try {
    const result = await agentOrchestrator();
    console.log("Agent run result:", result);
  } catch (err) {
    console.error("Agent error:", err);
  }
}

cron.schedule("*/5 * * * *", main);
main();
