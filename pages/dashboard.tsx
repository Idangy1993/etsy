import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatPrice } from "../lib/clientUtils";

interface Listing {
  listing_id: number;
  title: string;
  state: string;
  quantity: number;
  price: {
    amount: number;
    divisor: number;
    currency_code: string;
  };
}

interface ListingsResponse {
  results: Listing[];
  count: number;
}

export default function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/test-stats")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: ListingsResponse) => {
        setListings(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Shop Dashboard
            </h1>
            <p className="text-xl text-slate-300">
              Manage your Etsy listings and track performance
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <Card className="text-center">
              <div className="text-red-400 text-lg mb-2">⚠️ Error</div>
              <p className="text-slate-300">{error}</p>
            </Card>
          ) : listings.length > 0 ? (
            <div className="space-y-6">
              <Card>
                <h2 className="text-2xl font-bold mb-4 gradient-text">
                  Active Listings ({listings.length})
                </h2>
                <div className="grid gap-4">
                  {listings.map((listing) => (
                    <div
                      key={listing.listing_id}
                      className="glass p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {listing.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-400">
                            <span className="flex items-center">
                              <span
                                className={`w-2 h-2 rounded-full mr-2 ${
                                  listing.state === "active"
                                    ? "bg-emerald-500"
                                    : "bg-yellow-500"
                                }`}
                              ></span>
                              {listing.state}
                            </span>
                            <span>Quantity: {listing.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400">
                            {formatPrice(listing.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No Active Listings</h3>
              <p className="text-slate-400">
                Your shop doesn&apos;t have any active listings at the moment.
              </p>
            </Card>
          )}

          {/* Navigation */}
          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="secondary">← Back to Home</Button>
              </Link>
              <Link href="/reddit">
                <Button>Reddit Tools →</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
