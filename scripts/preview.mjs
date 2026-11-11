// Serves the static export in out/ under the configured base path, the way
// GitHub Pages does. A plain static server at the root can't do this: every
// asset URL in the export is prefixed with the base path, so they would 404.
//
//   pnpm start            → http://localhost:3000/claude-training/
//   PORT=4000 pnpm start  → another port

import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import nextConfig from '../next.config.mjs'

const root = resolve(fileURLToPath(new URL('../out', import.meta.url)))
const basePath = nextConfig.basePath ?? ''
const port = Number(process.env.PORT) || 3000

if (!existsSync(join(root, 'index.html'))) {
  console.error('No static export found in out/. Run `pnpm build` first.')
  process.exit(1)
}

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pagefind': 'application/octet-stream',
  '.pf_fragment': 'application/octet-stream',
  '.pf_index': 'application/octet-stream',
  '.pf_meta': 'application/octet-stream',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

function isFile(path) {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

function isDirectory(path) {
  try {
    return statSync(path).isDirectory()
  } catch {
    return false
  }
}

function send(req, res, status, file) {
  res.writeHead(status, {
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
  })
  if (req.method === 'HEAD') return res.end()
  createReadStream(file).pipe(res)
}

function redirect(res, status, location) {
  res.writeHead(status, { Location: location })
  res.end()
}

function notFound(req, res) {
  send(req, res, 404, join(root, '404.html'))
}

createServer((req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    return notFound(req, res)
  }

  if (pathname === '/' && basePath) return redirect(res, 302, `${basePath}/`)
  if (pathname === basePath) return redirect(res, 301, `${basePath}/`)
  if (!pathname.startsWith(`${basePath}/`)) return notFound(req, res)

  const target = resolve(join(root, pathname.slice(basePath.length)))
  if (target !== root && !target.startsWith(root + sep)) return notFound(req, res)

  if (isFile(target)) return send(req, res, 200, target)
  if (isDirectory(target) && isFile(join(target, 'index.html'))) {
    // trailingSlash: true — pages live at <path>/index.html.
    if (!pathname.endsWith('/')) return redirect(res, 301, `${pathname}/`)
    return send(req, res, 200, join(target, 'index.html'))
  }
  notFound(req, res)
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}${basePath}/`)
})
