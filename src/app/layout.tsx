import { type Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

// @ts-ignore CSS import
import '@/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s - AI Training',
    default: 'AI Training',
  },
  description:
    'Training materials, best practices, and documentation for AI coding tools — Zachary Moffitt',
}

// Blocking script — runs before first paint so the theme class is on <html>
// before the body's bg-white has a chance to render. Prevents FOLM (flash of
// light mode) on reload. Uses next-themes' default storageKey ("theme") and
// "system" sentinel, and writes both the class and colorScheme for parity
// with what next-themes applies after hydration.
const themeInitScript = `
(function(){try{
  var s=localStorage.getItem('theme');
  var m=window.matchMedia('(prefers-color-scheme: dark)').matches;
  var t=(s==='dark'||((!s||s==='system')&&m))?'dark':'light';
  document.documentElement.classList.add(t);
  document.documentElement.style.colorScheme=t;
}catch(e){}})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
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
