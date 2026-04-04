import '../styles/globals.css'
import type { Metadata } from 'next'

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
      <body>{children}</body>
    </html>
  )
}