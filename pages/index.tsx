import Link from "next/link";
import Button from "../components/Button";
import Card from "../components/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen text-center px-4">
        <div className="animate-float">
          <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-4xl">🧠</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in">
          Etsy Agent
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl animate-slide-up">
          Your AI-powered assistant for Etsy management and Reddit engagement
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Link href="/dashboard">
            <Button size="lg">🚀 Go to Dashboard</Button>
          </Link>

          <Link href="/reddit">
            <Button variant="secondary" size="lg">
              📱 Reddit Tools
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card className="text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-slate-400">
              Track your shop performance and insights
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-slate-400">
              Generate content and replies with AI
            </p>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold mb-2">Growth</h3>
            <p className="text-slate-400">Optimize your business for success</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
