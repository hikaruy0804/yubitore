import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ゆっくりタイピング",
  description: "速さを競わず、一文字ずつ正しい指づかいを練習するタイピングアプリ。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
