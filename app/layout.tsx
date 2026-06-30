import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BTC Dashboard",
  description: "Dashboard cen Bitcoina i rynku kryptowalut na żywo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body className="min-h-screen bg-zinc-950">{children}</body>
    </html>
  );
}
