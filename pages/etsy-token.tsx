import { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";

export default function EtsyToken() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [codeVerifier, setCodeVerifier] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAuthUrl = async () => {
    if (!clientId) {
      setError("Please enter your Client ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/etsy/auth");
      const data = await response.json();

      if (response.ok) {
        // Copy the authorization URL to clipboard
        navigator.clipboard.writeText(data.authUrl);
        // Store the code verifier for later use
        setCodeVerifier(data.codeVerifier);
        alert(
          "Authorization URL copied to clipboard! Paste it in your browser to get the authorization code."
        );
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to generate authorization URL");
    } finally {
      setLoading(false);
    }
  };

  const exchangeToken = async () => {
    if (!clientId || !clientSecret || !authCode || !codeVerifier) {
      setError(
        "Please fill in all fields and generate the authorization URL first"
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/etsy/exchange-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId,
          clientSecret,
          authCode,
          codeVerifier,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.access_token);
      } else {
        setError(data.error || "Failed to exchange token");
      }
    } catch (err) {
      setError("Failed to exchange token");
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
              Manual Etsy Token Generation
            </h1>
            <p className="text-xl text-slate-300">
              Alternative method to get your OAuth access token
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 1: Enter Your App Credentials
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client ID
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Your Etsy Client ID"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Client Secret
                </label>
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="Your Etsy Client Secret"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </Card>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 2: Get Authorization Code
            </h2>
            <p className="text-slate-300 mb-4">
              Click the button below to generate an authorization URL. Copy it
              and open it in your browser.
            </p>
            <Button
              onClick={generateAuthUrl}
              disabled={loading}
              className="w-full mb-4"
            >
              {loading
                ? "Generating..."
                : "📋 Generate & Copy Authorization URL"}
            </Button>
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
              <p className="text-sm text-slate-400 mb-2">
                <strong>How to get the authorization code:</strong>
              </p>
              <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
                <li>Click the button above to copy the authorization URL</li>
                <li>Paste the URL in your browser and press Enter</li>
                <li>Log in to Etsy and authorize your app</li>
                <li>
                  You'll be redirected to a URL like:{" "}
                  <code className="text-green-400">
                    http://localhost:3000/api/etsy/callback?code=abc123...
                  </code>
                </li>
                <li>
                  Copy the <code className="text-green-400">code</code>{" "}
                  parameter value (everything after{" "}
                  <code className="text-green-400">code=</code>)
                </li>
                <li>Paste it in the field below</li>
              </ol>
            </div>
            {codeVerifier && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 text-sm">
                  ✅ Authorization URL generated successfully! Code verifier is
                  ready for token exchange.
                </p>
              </div>
            )}
          </Card>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-4 gradient-text">
              Step 3: Exchange Code for Token
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
                disabled={loading || !codeVerifier}
                className="w-full"
              >
                {loading ? "Exchanging..." : "Exchange Code for Token"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}
          </Card>

          {token && (
            <Card>
              <h2 className="text-2xl font-bold mb-4 gradient-text">
                Step 4: Copy Access Token
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
