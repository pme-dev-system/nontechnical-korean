import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "やさしい技術辞典 — AI・開発用語100個を例えで",
    template: "%s — やさしい技術辞典",
  },
  description:
    "AIと開発の用語100個を、専門知識がなくても理解できるように例え話と具体例で解説する日本語辞典。8つのカテゴリーに整理。",
  keywords: ["AI用語", "開発用語", "技術辞典", "非エンジニア", "やさしい解説", "日本語"],
  openGraph: {
    title: "やさしい技術辞典 — AI・開発用語100個を例えで",
    description: "AIと開発の用語100個を例え話と具体例で解説する日本語辞典。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
