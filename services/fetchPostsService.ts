import { fetchAndProcessPosts } from "@/pages/api/postPipeline";
import { supabase } from "@/lib/supabaseClient";

export async function fetchPostsService() {
  const result = await fetchAndProcessPosts();
  const batchId = Date.now().toString();
  // Get all existing post URLs
  const { data: existingPosts, error: fetchError } = await supabase
    .from("reddit_posts")
    .select("url");
  if (fetchError)
    throw new Error("Failed to fetch existing posts: " + fetchError.message);
  const existingUrls = new Set((existingPosts || []).map((p: any) => p.url));
  // Filter out posts with URLs already in the DB
  const newPosts = (result.topRanked || []).filter(
    (post: any) => !existingUrls.has(post.url)
  );
  // Add batch_id to each new post
  const postsToInsert = newPosts.map((post: any) => ({
    ...post,
    batch_id: batchId,
  }));
  // Insert new posts for this batch
  let inserted = 0;
  if (postsToInsert.length > 0) {
    const { error } = await supabase.from("reddit_posts").insert(postsToInsert);
    if (error) throw new Error("Failed to save posts to DB: " + error.message);
    inserted = postsToInsert.length;
  }
  return { batchId, inserted, ...result };
}
