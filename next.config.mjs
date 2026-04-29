import nextMDX from '@next/mdx'

// Plugins are passed as string tuples so the loader options are serializable
// for Turbopack (default builder in Next 16). Direct function imports are not
// serializable across the Turbopack worker boundary.
const withMDX = nextMDX({
  options: {
    remarkPlugins: [['remark-gfm']],
    rehypePlugins: [['rehype-slug']],
  },
})

const basePath = '/claude-training'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
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
