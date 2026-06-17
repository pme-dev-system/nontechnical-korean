import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "쉬운 기술 사전 — AI·개발 용어 100개를 비유로",
    template: "%s — 쉬운 기술 사전",
  },
  description:
    "AI와 개발 용어 100개를 고등학생도 이해할 수 있게 비유와 예시로 풀어 쓴 한국어 사전. 8개 카테고리로 정리.",
  keywords: ["AI 용어", "개발 용어", "기술 사전", "비전공자", "쉬운 설명", "한국어"],
  openGraph: {
    title: "쉬운 기술 사전 — AI·개발 용어 100개를 비유로",
    description: "AI와 개발 용어 100개를 비유와 예시로 풀어 쓴 한국어 사전.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
