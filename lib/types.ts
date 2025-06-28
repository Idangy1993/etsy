export interface RedditPost {
  keyword: string;
  title: string;
  url: string;
  subreddit: string;
  content: string;
  upvotes: number;
}
export type Post = {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  reply?: string;
};