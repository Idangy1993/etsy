import { fetchPostsService } from "./fetchPostsService";
import { generateRepliesService } from "./generateRepliesService";

export async function agentOrchestrator() {
  const fetchResult = await fetchPostsService();
  let replyResult = null;
  if (fetchResult.batchId) {
    replyResult = await generateRepliesService(fetchResult.batchId);
  }
  return { fetchResult, replyResult };
}
