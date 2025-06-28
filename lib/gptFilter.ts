/**
 * GPT-powered content filtering for Reddit posts
 * Filters posts based on brand alignment and emotional resonance
 */

import type { RedditPost } from "./filterPosts";
import { ChatCompletionMessageParam } from "openai/resources/chat";
import { logger } from "./logger";
import { createOpenAIClient } from "./serverUtils";
import { API_CONFIG, FILE_PATHS } from "./constants";
import { writeJsonFile } from "./serverUtils";

const SYSTEM_PROMPT = `
You are the content filter agent for a chaotic Etsy brand called Straight Backwards.

The brand sells sarcastic, darkly funny, emotionally unhinged, queer-coded graphic T-shirts and sweatshirts printed on Comfort Colors blanks. It's a place for people who cope with pain by oversharing and turning breakdowns into punchlines.

🎯 Your job:
Scan Reddit posts and return only those that are emotionally aligned with the brand's tone and audience. These should be perfect for:

Making relatable comment replies
Sparking design ideas
Driving real, organic traffic to the shop

🧠 The brand speaks to people who are:
LGBTQ+, anxious, emotionally unstable, neurodivergent
Burnt out, overthinking, dissociating, or spiraling
Using humor as a defense mechanism
Posting "what the f*ck is happening" with no punctuation

🧢 Good post criteria:
Return true if a post:
Feels unfiltered, emotional, or self-aware in a chaotic way
Could easily be turned into a meme or sarcastic shirt quote
Talks about burnout, mental health, bad coping, identity crisis, queer messiness, existential dread, weird therapy thoughts, or broken dating lives
Makes you think: "same", "me af", or "I'd wear that on a shirt"

🚫 Reject posts that are:
Dry advice, political rants, finance or career tips
Rational, solution-oriented, or long and lifeless
Tech/academic debates, marketing threads, or generic memes
Just venting without humor, irony, or any weird sparkle

Examples of aligned post topics:
"Can't stop spiraling before bed"
"Said 'I'm fine' 8 times today and dissociated during 3 of them"
"Went to therapy and made it worse somehow"
"I am a gay disaster and it's getting worse"

🛑 Response Format:
For each post, just return:
true → if it fits the brand
false → if it doesn't
No explanation, no markdown, just raw output
`;

export async function filterWithGPT(
  posts: RedditPost[]
): Promise<RedditPost[]> {
  const openai = createOpenAIClient();
  const accepted: RedditPost[] = [];
  const debug: Array<{
    isAccepted: boolean;
    answer: string | undefined;
    title: string;
  }> = [];

  logger.info(`Starting GPT filtering for ${posts.length} posts`);

  for (const post of posts) {
    const prompt = `
Title: ${post.title}

Content:
${post.content || "(no content)"}
    `.trim();

    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ];

    try {
      const response = await openai.chat.completions.create({
        model: API_CONFIG.OPENAI.MODEL,
        messages,
        temperature: API_CONFIG.OPENAI.TEMPERATURE.FILTER,
      });

      const answer = response.choices[0]?.message?.content
        ?.trim()
        .toLowerCase();
      const isAccepted = answer === "true";

      debug.push({ isAccepted, answer, title: post.title });

      if (isAccepted) {
        accepted.push(post);
      }
    } catch (error) {
      logger.error("GPT filtering error for post", {
        title: post.title,
        error,
      });
    }
  }

  // Save debug info in development only
  if (process.env.NODE_ENV === "development") {
    writeJsonFile(FILE_PATHS.GPT_FILTER_DEBUG, debug);
  }

  logger.info(
    `GPT filtering complete: ${accepted.length}/${posts.length} posts accepted`
  );
  return accepted;
}
