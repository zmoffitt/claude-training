import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

// @ts-ignore CSS import
import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: {
    template: '%s - Cloud AI Training',
    default: 'Cloud AI Training',
  },
  description:
    'Training materials, best practices, and documentation for AI coding tools — Platform Engineering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="flex min-h-full bg-white antialiased dark:bg-zinc-900">
        <Providers>
          <div className="w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
