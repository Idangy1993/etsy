import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function EtsySimple() {
  const [authCode, setAuthCode] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const generateAuthUrl = () => {
    const clientId =
      process.env.NEXT_PUBLIC_ETSY_CLIENT_ID || "your_client_id_here";
    const redirectUri = "http://localhost:3000/api/etsy/callback";
    const authUrl = `https://www.etsy.com/oauth/connect?response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=listings_r&client_id=${clientId}&state=random_state_string`;

    // Copy to clipboard
    navigator.clipboard.writeText(authUrl);
    alert(
      "Authorization URL copied to clipboard! Paste it in your browser to get the authorization code."
    );
  };

  const exchangeToken = async () => {
    if (!authCode) {
      setError("Please enter the authorization code");
      return;
    }

    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      const response = await fetch("/api/etsy/exchange-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId:
            process.env.NEXT_PUBLIC_ETSY_CLIENT_ID || "your_client_id_here",
          clientSecret: "your_client_secret_here", // This should come from server
          authCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);
        setDebugInfo("Token exchange successful!");
      } else {
        setError(data.error || "Failed to exchange token");
        setDebugInfo(`Status: ${response.status}, Details: ${data.details}`);
      }
    } catch (err) {
      setError("Failed to exchange token");
      setDebugInfo(err instanceof Error ? err.message : "Unknown error");
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
              Simple Etsy OAuth
            </h1>
            <p className="text-xl text-slate-300">
              Get your OAuth access token step by step
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 1: Get Authorization URL
            </h2>
            <p className="text-slate-300 mb-4">
              Click the button below to generate an authorization URL.
            </p>
            <Button onClick={generateAuthUrl} className="w-full mb-4">
              📋 Generate & Copy Authorization URL
            </Button>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">
                <strong>Instructions:</strong>
              </p>
              <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                <li>Click the button above to copy the authorization URL</li>
                <li>Paste the URL in your browser and press Enter</li>
                <li>Log in to Etsy and authorize your app</li>
                <li>
                  You'll be redirected to a URL with a{" "}
                  <code className="text-green-400">code</code> parameter
                </li>
                <li>Copy the entire code value and paste it below</li>
              </ol>
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 2: Exchange Code for Token
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Authorization Code
                </label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  placeholder="Paste the authorization code from Etsy"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <Button
                onClick={exchangeToken}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Exchanging..." : "Exchange Code for Token"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 font-semibold">Error: {error}</p>
                {debugInfo && (
                  <p className="text-red-300 text-sm mt-2">{debugInfo}</p>
                )}
              </div>
            )}
          </Card>

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
