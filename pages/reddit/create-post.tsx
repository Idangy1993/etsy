// pages/reddit/create-post.tsx

import { useState } from "react";
import Link from "next/link";
import Card from "../../components/Card";
import Button from "../../components/Button";

const SUBREDDITS = [
  "Profile",
  "r/OffMyChest",
  "r/TrueOffMyChest",
  "r/Vent",
  "r/CPTSD",
  "r/FuckPTSD",
  "r/Anxiety",
  "r/LGBT",
  "r/askgaybros",
  "r/mentalhealth",
  "r/lgbtmemes",
];

export default function CreatePost() {
  const [generatedPost, setGeneratedPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] = useState("Profile");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setGeneratedPost("");

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subreddit: selectedSubreddit }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneratedPost(data.post || "No post generated");
    } catch {
      setError("Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleSubredditClick = (subreddit: string) => {
    setSelectedSubreddit(subreddit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Generate Reddit Post
          </h1>
          <p className="text-xl text-slate-300">
            Create engaging posts with AI assistance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-slate-300 mb-2">
                    Selected:{" "}
                    <span className="text-blue-400 font-semibold">
                      {selectedSubreddit}
                    </span>
                  </p>
                </div>
                <Button onClick={handleGenerate} loading={loading} size="lg">
                  ✨ Generate Post
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-400">{error}</p>
                </div>
              )}
            </Card>

            {generatedPost && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold gradient-text">
                    Generated Post
                  </h2>
                  <div className="relative flex items-center">
                    <Button
                      onClick={copyToClipboard}
                      variant="secondary"
                      size="sm"
                    >
                      📋 Copy
                    </Button>
                    {copied && (
                      <span className="ml-2 text-emerald-400 text-xs font-semibold animate-fade-in">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>

                <div className="glass p-6 rounded-lg">
                  <pre className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedPost}
                  </pre>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">
                      Generated for:{" "}
                      <span className="text-blue-400 font-medium">
                        {selectedSubreddit}
                      </span>
                    </span>
                    {selectedSubreddit !== "Profile" && (
                      <a
                        href={`https://reddit.com/${selectedSubreddit}/submit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        📱 Post to {selectedSubreddit}
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}

            <div className="mt-8 text-center">
              <Link href="/reddit">
                <Button variant="secondary">← Back to Reddit Tools</Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <h3 className="text-lg font-semibold gradient-text mb-4">
                Select Subreddit
              </h3>
              <div className="space-y-2">
                {SUBREDDITS.map((subreddit) => (
                  <div
                    key={subreddit}
                    onClick={() => handleSubredditClick(subreddit)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer group ${
                      selectedSubreddit === subreddit
                        ? "bg-blue-500/20 border-blue-500/50"
                        : "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
                    }`}
                  >
                    <span
                      className={`font-medium transition-colors ${
                        selectedSubreddit === subreddit
                          ? "text-blue-400"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {subreddit}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  💡 Click to select a subreddit for tailored content generation
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
