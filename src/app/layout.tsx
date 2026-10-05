import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/navbar';
import { AuthProvider } from '@/components/ui/auth-provider';

export const metadata: Metadata = {
  title: {
    default: '英萃英语学习',
    template: '%s | 英萃英语学习',
  },
  description:
    '英萃英语学习 - 结合优秀材料，聚焦高一英语的在线学习平台，多模块整合学习、智能复习、进度追踪，助力高一英语学习。',
  keywords: [
    '高一英语',
    '英语学习',
    '英萃英语',
    '优秀英语材料',
    '语法学习',
    '词汇学习',
    '英语文化',
    '在线学习',
  ],
  authors: [{ name: '英萃英语学习' }],
  generator: 'Next.js',
  openGraph: {
    title: '英萃英语学习',
    description:
      '英萃英语学习 - 结合优秀材料，聚焦高一英语的在线学习平台，十大学习模块，覆盖词汇、语法、文化等多个方面。',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
