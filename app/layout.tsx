import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "Next.js Template",
    template: "%s | Next.js Template",
  },
  description: "A modern Next.js template with authentication and database integration",
  keywords: ["Next.js", "React", "Tailwind CSS", "Server Components", "Authentication"],
  authors: [
    {
      name: "Your Name",
      url: "https://your-website.com",
    },
  ],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-website.com",
    title: "Next.js Template",
    description: "A modern Next.js template with authentication and database integration",
    siteName: "Next.js Template",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js Template",
    description: "A modern Next.js template with authentication and database integration",
    creator: "@yourusername",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
          <Toaster />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}