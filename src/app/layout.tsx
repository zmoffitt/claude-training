import { type Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

// @ts-ignore CSS import
import '@/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// Display face for H1/H2, hero headlines, and the roadmap numerals. Body stays
// on Inter: the identity lives in the headings, the reading stays neutral.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  axes: ['opsz'],
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
    <html lang="en" className={`h-full ${inter.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* suppressHydrationWarning: browser extensions such as Grammarly add
          data-* attributes to <body> before React hydrates, which otherwise
          logs a mismatch on every page. Attribute-only; children still check. */}
      <body
        className="flex min-h-full bg-paper antialiased dark:bg-ink"
        suppressHydrationWarning
      >
        <Providers>
          <div className="w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
