import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: '天机阁 - AI占卜平台',
  description: '融合东方命理与西方占卜的AI占卜平台，探索你的命运之旅',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-slate-900 star-bg">
        {children}
      </body>
    </html>
  )
}
