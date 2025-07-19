import { supabase } from "@/lib/supabaseClient";
import { generateRepliesForPosts } from "@/lib/gptReplyGenerator";

export async function generateRepliesService(batchId?: string) {
  // Get the latest batch_id if not provided
  if (!batchId) {
    const { data: latestBatch, error: batchError } = await supabase
      .from("reddit_posts")
      .select("batch_id")
      .order("batch_id", { ascending: false })
      .limit(1);
    if (batchError) throw batchError;
    batchId = latestBatch?.[0]?.batch_id;
    if (!batchId) {
      return { message: "No posts to generate replies for", count: 0 };
    }
  }
  // Fetch posts from the batch
  const { data: posts, error } = await supabase
    .from("reddit_posts")
    .select("*")
    .eq("batch_id", batchId);
  if (error) throw error;
  if (!posts || posts.length === 0) {
    return { message: "No posts to generate replies for", count: 0 };
  }
  const replies = await generateRepliesForPosts(posts);
  // Update each post with its reply
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const reply = replies[i] || "";
    await supabase.from("reddit_posts").update({ reply }).eq("id", post.id);
  }
  return {
    message: "Replies generated and saved successfully",
    count: posts.length,
  };
}
