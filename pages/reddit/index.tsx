import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "../../components/Card";
import Button from "../../components/Button";

type Post = {
  title: string;
  content: string;
  url: string;
  subreddit: string;
  reply?: string;
};

export default function RedditPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyStatus, setReplyStatus] = useState("");
  const [fetchingPosts, setFetchingPosts] = useState(false);
  const [fetchStatus, setFetchStatus] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    const res = await fetch("/api/found-posts");
    const data = await res.json();
    setPosts(data);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleGenerateReplies = async () => {
    setLoadingReplies(true);
    setReplyStatus("Generating replies...");
    try {
      const res = await fetch("/api/generate-replies", { method: "POST" });
      const result = await res.json();
      setReplyStatus(
        result.message
          ? `✅ ${result.message}`
          : "✅ Replies generated successfully"
      );
      await fetchPosts();
    } catch {
      setReplyStatus("❌ Failed to generate replies.");
    }
    setLoadingReplies(false);
  };

  const handleFetchAndFilterPosts = async () => {
    setFetchingPosts(true);
    setFetchStatus("🔄 Fetching and filtering Reddit posts...");
    try {
      const res = await fetch("/api/fetch-posts", { method: "POST" });
      const result = await res.json();
      setFetchStatus(`✅ ${result.message}`);
      await fetchPosts();
    } catch {
      setFetchStatus("❌ Failed to fetch posts.");
    }
    setFetchingPosts(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Reddit Tools
          </h1>
          <p className="text-xl text-slate-300">
            Find relevant posts and generate AI-powered replies
          </p>
        </div>

        <Card className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              onClick={handleFetchAndFilterPosts}
              loading={fetchingPosts}
              className="flex-1"
              size="lg"
            >
              🔍 Fetch & Rank Posts
            </Button>

            <Link href="/reddit/create-post" className="flex-1">
              <Button variant="secondary" className="w-full" size="lg">
                ✨ Generate Post
              </Button>
            </Link>
          </div>

          {fetchStatus && (
            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <p className="text-slate-300">{fetchStatus}</p>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleGenerateReplies}
              loading={loadingReplies}
              className="w-full"
              size="lg"
            >
              💬 Generate Replies
            </Button>

            {replyStatus && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <p className="text-slate-300">{replyStatus}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
              <p className="text-slate-400">Fetch some posts to get started!</p>
            </Card>
          ) : (
            posts.map((post, index) => (
              <Card key={index}>
                <button
                  onClick={() => setExpanded(index === expanded ? null : index)}
                  className="text-left w-full"
                >
                  <h3 className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    r/{post.subreddit} • {expanded === index ? "▼" : "▶"}
                  </p>
                </button>

                {expanded === index && (
                  <div className="mt-4 space-y-4 animate-slide-up">
                    <div className="glass p-4 rounded-lg">
                      <p className="text-slate-300 whitespace-pre-wrap text-sm">
                        {post.content || "(No content)"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                      >
                        🔗 View on Reddit
                      </a>

                      {post.reply && (
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(post.reply || "");
                            setCopiedIndex(index);
                            setTimeout(() => setCopiedIndex(null), 1500);
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          📋 Copy Reply
                        </Button>
                      )}
                      {post.reply && copiedIndex === index && (
                        <span className="ml-2 text-emerald-400 text-xs font-semibold animate-fade-in">Copied!</span>
                      )}
                    </div>

                    {post.reply && (
                      <div className="glass p-4 rounded-lg border-l-4 border-emerald-500">
                        <div className="flex items-center mb-2">
                          <span className="text-emerald-400 mr-2">🤖</span>
                          <strong className="text-emerald-400">
                            AI Reply:
                          </strong>
                        </div>
                        <p className="text-slate-300 whitespace-pre-wrap text-sm">
                          {post.reply}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
