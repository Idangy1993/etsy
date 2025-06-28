// lib/rankPostsForTrafficPotential.ts
import OpenAI from "openai";
import { type Post } from "@/types";
import { ChatCompletionMessageParam } from "openai/resources/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function rankPostsForTrafficPotential(
  posts: Post[]
): Promise<Post[]> {
  const systemPrompt = `
You are an expert Reddit growth strategist for a brand called "Straight Backwards".

This Etsy brand sells Comfort Colors T-shirts and sweatshirts with dark humor, meme-core, queer-coded, emotionally chaotic slogans. Its voice is sarcastic, self-aware, and made for people who overshare, overthink, disassociate, and laugh at their trauma.

Your goal: From the list of Reddit posts below, choose **up to 7 posts** that have the **highest potential to drive traffic** to this brand *if a smart, funny, emotionally raw reply is left on them.*

The right post should:
- Be emotionally charged, unhinged, or painfully relatable
- Feel like something the target audience would *click a profile from*
- Make someone say "same" or "me af"
- Offer a moment for trauma bonding, sarcasm, or dark humor

Avoid posts that:
- Are too dry, informative, or political
- Have no emotional punch or joke potential
- Feel off-brand or boring to a chaotic queer-coded audience

IMPORTANT: Return ONLY a JSON array of the best post indices (starting from 0), with no markdown formatting, no code blocks, no explanation. Example: [2, 5, 1, 7, 3, 6, 4]
`;

  const userPrompt = posts
    .map(
      (post, i) => `Post ${i}:
Title: ${post.title}
Content: ${post.content || "(no content)"}`
    )
    .join("\n\n");

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    temperature: 0.4,
  });

  const raw = response.choices[0].message.content || "";

  try {
    // Clean the response to remove markdown formatting
    let cleaned = raw.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const indices: number[] = JSON.parse(cleaned);

    // Filter out-of-bounds indices returned by the model
    const validIndices = indices.filter(
      (i) => typeof i === "number" && i >= 0 && i < posts.length
    );

    if (Array.isArray(validIndices) && validIndices.length > 0) {
      return validIndices.map((i) => posts[i]);
    }
  } catch (err) {
    console.error("❌ Failed to parse ranking output:", raw, err);
  }

  throw new Error("Failed to rank posts or parse result.");
}
