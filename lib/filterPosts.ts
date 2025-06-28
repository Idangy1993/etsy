/**
 * Basic filtering logic for Reddit posts
 * Filters posts based on keywords, length, and upvotes
 */

import { SEARCH_KEYWORDS } from "./keywords";
import { VALIDATION } from "./constants";
import { cleanTextForSearch } from "./clientUtils";

export interface RedditPost {
  keyword: string;
  title: string;
  url: string;
  subreddit: string;
  content: string;
  upvotes: number;
}

export function filterRedditPosts(posts: RedditPost[]): RedditPost[] {
  return posts.filter((post) => {
    const title = post.title || "";
    const content = post.content || "";
    const fullText = cleanTextForSearch(`${title} ${content}`);

    const hasKeyword = SEARCH_KEYWORDS.some((keyword) =>
      fullText.includes(keyword.toLowerCase())
    );

    return (
      hasKeyword &&
      fullText.length >= VALIDATION.MIN_POST_LENGTH &&
      post.upvotes >= VALIDATION.MIN_UPVOTES
    );
  });
}
