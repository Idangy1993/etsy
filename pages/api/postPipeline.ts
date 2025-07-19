/**
 * Reddit post processing pipeline
 * Fetches, filters, ranks, and saves Reddit posts
 */

import { SEARCH_KEYWORDS } from "@/lib/keywords";
import { filterRedditPosts } from "@/lib/filterPosts";
import { filterWithGPT } from "@/lib/gptFilter";
import { rankPostsForTrafficPotential } from "@/lib/rankPostsForTrafficPotential";
import { createRedditClient } from "@/lib/serverUtils";
import { writeJsonFile } from "@/lib/serverUtils";
import { FILE_PATHS } from "@/lib/constants";
import { API_CONFIG } from "@/lib/constants";
import { logger } from "@/lib/logger";

export async function fetchAndProcessPosts() {
  let reddit;
  try {
    reddit = createRedditClient();
    logger.info("Reddit client created successfully");
  } catch (err) {
    logger.error("Failed to create Reddit client", err);
    throw err;
  }
  const allPosts = [];

  // Fetch posts for each keyword
  for (const keyword of SEARCH_KEYWORDS) {
    try {
      logger.info(`Searching Reddit for keyword: ${keyword}`);
      const results = await reddit.search({
        query: keyword,
        sort: API_CONFIG.REDDIT.SEARCH_SORT,
        time: API_CONFIG.REDDIT.SEARCH_TIME,
        limit: API_CONFIG.REDDIT.SEARCH_LIMIT,
      });
      logger.info(
        `Reddit search returned ${results.length} results for keyword: ${keyword}`
      );
      const posts = results.map((post: any) => ({
        keyword,
        title: post.title,
        url: `https://reddit.com${post.permalink}`,
        subreddit: post.subreddit_name_prefixed,
        content: post.selftext,
        upvotes: post.ups,
        created_utc: post.created_utc,
      }));
      logger.info(`Pulled ${posts.length} posts for keyword`, { keyword });
      allPosts.push(...posts);
    } catch (err) {
      logger.error(`Reddit search failed for keyword: ${keyword}`, err);
      throw err;
    }
  }

  logger.info(`Total posts pulled from Reddit: ${allPosts.length}`);

  // Apply filters
  const basicFiltered = filterRedditPosts(allPosts);
  logger.info(`After basic filtering: ${basicFiltered.length} posts`);

  const gptFiltered = await filterWithGPT(basicFiltered);
  logger.info(`GPT filtered: ${gptFiltered.length} posts`);

  const topRanked = await rankPostsForTrafficPotential(gptFiltered);
  logger.info(`Top ranked posts selected: ${topRanked.length}`);

  // Save results
  console.log(`[fetch-posts] Writing posts to: ${FILE_PATHS.FOUND_POSTS}`);
  const success = writeJsonFile(FILE_PATHS.FOUND_POSTS, topRanked);
  logger.info(`writeJsonFile result: ${success}`);
  if (!success) {
    throw new Error("Failed to save posts to file");
  }

  return {
    total: allPosts.length,
    basicFiltered: basicFiltered.length,
    gptFiltered: gptFiltered.length,
    final: topRanked.length,
  };
}
