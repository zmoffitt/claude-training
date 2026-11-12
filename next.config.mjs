import { fileURLToPath } from 'node:url'

import nextMDX from '@next/mdx'

// Plugins are passed as string tuples so the loader options are serializable
// for Turbopack (default builder in Next 16). Direct function imports are not
// serializable across the Turbopack worker boundary.
// The local plugin goes in by absolute path for the same reason: the loader
// resolves a plugin name from the directory of the page it is compiling.
const pageOutlinePlugin = fileURLToPath(
  new URL('./scripts/remark-page-outline.mjs', import.meta.url),
)

const withMDX = nextMDX({
  options: {
    remarkPlugins: [['remark-gfm'], [pageOutlinePlugin]],
    rehypePlugins: [['rehype-slug']],
  },
})

const basePath = '/claude-training'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  transpilePackages: ['next-themes'],
  experimental: {
    optimizePackageImports: ['@headlessui/react', 'framer-motion', 'react-syntax-highlighter'],
  },
}

export default withMDX(nextConfig)
