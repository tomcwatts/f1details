import type { Metadata } from 'next'
import './globals.css'
import 'flag-icons/css/flag-icons.min.css'
import { Tourney } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'

// Register fonts and expose them as CSS variables for Tailwind
const fontDisplay = Tourney({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'F1 Insights - Formula 1 Race Data & Analytics',
  description: 'Get comprehensive Formula 1 race insights, upcoming schedules, driver statistics, and real-time race data.',
  keywords: 'Formula 1, F1, Racing, Driver Standings, Race Calendar, Live Timing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} ${fontDisplay.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  )
}