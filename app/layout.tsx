import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000'),
  title: '王奕 · 个人论文集',
  description: '经济、环境与区域发展研究成果个人典藏。',
  openGraph: {
    title: '王奕 · 个人论文集',
    description: '经济、环境与区域发展研究：6 篇论文、117 页完整原文。',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '王奕 · 个人论文集' }],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '王奕 · 个人论文集',
    description: '经济、环境与区域发展研究：6 篇论文、117 页完整原文。',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
