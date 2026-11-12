import { type Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import { siteName } from '@/lib/site'

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

// The icons are declared here instead of through Next's icon file names. With
// favicon.ico and icon.svg both in the app root, Next 16.4 leaves the .ico
// link off the home page. Both files are in public/, so each URL carries the
// base path itself. The .ico comes first and names its sizes, so a browser
// that can draw the SVG picks the SVG.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const metadata: Metadata = {
  title: {
    template: `%s - ${siteName}`,
    default: siteName,
  },
  description:
    'Training materials, best practices, and documentation for AI coding tools — Zachary Moffitt',
  icons: {
    icon: [
      { url: `${basePath}/favicon.ico`, sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: `${basePath}/icon.svg`, sizes: 'any', type: 'image/svg+xml' },
    ],
  },
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
