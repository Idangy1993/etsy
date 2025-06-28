import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import Input from "./Input";

export default function RedditSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/reddit?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data);
    } catch {
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 gradient-text">
        Search Reddit
      </h2>

      <div className="flex gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Reddit posts..."
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} loading={loading}>
          🔍 Search
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result: any, index: number) => (
            <div key={index} className="glass p-3 rounded-lg">
              <h3 className="font-medium text-white">{result.title}</h3>
              <p className="text-sm text-slate-400">{result.subreddit}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
