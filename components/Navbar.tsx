import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center animate-pulse-slow">
          <span className="text-white font-bold text-sm">🧠</span>
        </div>
        <h1 className="text-xl font-bold gradient-text">Etsy Agent</h1>
      </div>

      <div className="flex items-center space-x-6">
        <Link href="/" className="btn-primary text-sm">
          🏠 Home
        </Link>
        <Link
          href="/dashboard"
          className="text-slate-300 hover:text-emerald-400 font-medium transition-all duration-200 hover:scale-105"
        >
          Dashboard
        </Link>
        <Link
          href="/reddit"
          className="text-slate-300 hover:text-emerald-400 font-medium transition-all duration-200 hover:scale-105"
        >
          Reddit
        </Link>
        <Link href="/reddit/create-post" className="btn-secondary text-sm">
          Create Post
        </Link>
      </div>
    </nav>
  );
}
