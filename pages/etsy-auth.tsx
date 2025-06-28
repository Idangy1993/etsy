import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function EtsyAuth() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthUrl = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/etsy/auth");
      const data = await response.json();

      if (response.ok) {
        setAuthUrl(data.authUrl);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to get authorization URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      alert(
        "Access token copied to clipboard! Add it to your .env.local as ETSY_ACCESS_TOKEN"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Etsy OAuth Setup
            </h1>
            <p className="text-xl text-slate-300">
              Get your OAuth access token to access all listings
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 1: Get Authorization URL
            </h2>
            <p className="text-slate-300 mb-4">
              Click the button below to get the Etsy OAuth authorization URL.
            </p>
            <Button onClick={getAuthUrl} disabled={loading} className="w-full">
              {loading ? "Loading..." : "Get Authorization URL"}
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </Card>

          {authUrl && (
            <Card className="mb-8">
              <h2 className="text-2xl font-bold mb-4 gradient-text">
                Step 2: Complete OAuth Flow
              </h2>
              <p className="text-slate-300 mb-4">
                Click the link below to authorize your Etsy app and get an
                access token.
              </p>
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                🔗 Authorize Etsy App
              </a>
              <p className="text-sm text-slate-400 mt-2">
                This will open Etsy in a new tab. After authorization, you'll be
                redirected back here.
              </p>
            </Card>
          )}

          {token && (
            <Card>
              <h2 className="text-2xl font-bold mb-4 gradient-text">
                Step 3: Copy Access Token
              </h2>
              <p className="text-slate-300 mb-4">
                Your access token has been generated. Copy it and add it to your
                .env.local file.
              </p>
              <div className="bg-slate-800 p-4 rounded-lg mb-4">
                <code className="text-green-400 break-all">{token}</code>
              </div>
              <Button onClick={copyToken} className="w-full">
                📋 Copy Token to Clipboard
              </Button>
              <p className="text-sm text-slate-400 mt-2">
                Add this to your .env.local as:
                ETSY_ACCESS_TOKEN=your_token_here
              </p>
            </Card>
          )}

          <div className="mt-12 text-center">
            <a href="/dashboard">
              <Button variant="secondary">← Back to Dashboard</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
