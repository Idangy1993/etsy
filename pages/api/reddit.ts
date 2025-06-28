import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import Snoowrap from "snoowrap";
import { SEARCH_KEYWORDS } from "@/lib/keywords";
import { filterRedditPosts } from "@/lib/filterPosts";
import { filterWithGPT } from "@/lib/gptFilter";

const reddit = new Snoowrap({
  userAgent: "straight-backwards-agent",
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD,
});

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const allPosts = [];

    for (const keyword of SEARCH_KEYWORDS) {
      const results = await reddit.search({
        query: keyword,
        sort: "new",
        time: "year",
        limit: 5,
      });

      const posts = results.map((post) => ({
        keyword,
        title: post.title,
        url: `https://reddit.com${post.permalink}`,
        subreddit: post.subreddit_name_prefixed,
        content: post.selftext,
        upvotes: post.ups,
      }));

      console.log(`🔍 Pulled ${posts.length} posts for keyword: "${keyword}"`);
      allPosts.push(...posts);
    }

    console.log(`📦 Total posts pulled from Reddit: ${allPosts.length}`);

    const filteredPosts = filterRedditPosts(allPosts);
    console.log(
      `🧹 After basic filtering: ${filteredPosts.length} posts remaining`
    );

    const gptFiltered = await filterWithGPT(filteredPosts);
    console.log(`🧠 GPT accepted ${gptFiltered.length} posts`);

    const filePath = path.join(process.cwd(), "data", "foundPosts.json");
    fs.writeFileSync(filePath, JSON.stringify(gptFiltered, null, 2));

    res.status(200).json({
      message: "Posts saved successfully",
      pulled: allPosts.length,
      afterBasicFilter: filteredPosts.length,
      afterGPTFilter: gptFiltered.length,
    });
  } catch (err: unknown) {
    console.error("❌ Reddit API error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "An unknown error occurred",
    });
  }
}
