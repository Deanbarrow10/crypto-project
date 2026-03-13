import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoinPulse | Real-Time Crypto Intelligence",
  description:
    "Real-time cryptocurrency market data powered by the Coinbase Advanced Trade API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {/* Navigation */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">
                CP
              </div>
              <span className="text-xl font-bold">
                Coin<span className="text-blue-400">Pulse</span>
              </span>
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Markets
              </Link>
              <a
                href="https://docs.cdp.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Coinbase API Docs
              </a>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                Powered by Coinbase
              </span>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-800 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-600">
            <p>
              Built with the{" "}
              <a
                href="https://docs.cdp.coinbase.com/coinbase-app/advanced-trade-apis/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Coinbase Advanced Trade API
              </a>{" "}
              (Public Endpoints) | Next.js + TypeScript + Tailwind
            </p>
            <p className="mt-1">
              Market data refreshes every 5 seconds. Not financial advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
