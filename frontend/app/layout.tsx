import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import { ToastProvider } from "@/components/shared/simple-toast"
import { OnboardingProvider } from "@/lib/onboarding-context"
import { AppShell } from "@/components/layout/app-shell"

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'UDOFIN - Smart Loan Platform',
  description: 'AI-powered loan platform with seamless onboarding, instant document verification, and personalized loan offers.',
  generator: 'v0.app',
  icons: {
    // icon: [
    //   { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
    //   { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    //   { url: '/icon.svg', type: 'image/svg+xml' },
    // ],
    // apple: '/apple-icon.png',
    icon: '/logo.jpeg', 
    apple: '/logo.jpeg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ToastProvider>
          <OnboardingProvider>
            <AppShell>
              {children}
            </AppShell>
          </OnboardingProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}