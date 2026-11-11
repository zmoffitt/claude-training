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
const port = process.env.PORT ? Number(process.env.PORT) : 3000

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`PORT must be a number from 1 to 65535, got "${process.env.PORT}".`)
  process.exit(1)
}

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

function plain(res, status, message, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', ...headers })
  res.end(`${message}\n`)
}

function send(req, res, status, file) {
  const headers = {
    'Content-Type': types[extname(file)] ?? 'application/octet-stream',
  }
  if (req.method === 'HEAD') {
    res.writeHead(status, headers)
    return res.end()
  }

  // Headers wait for the file to open: a rebuild empties out/ while the server
  // is up, and a file that vanished after the stat must not take it down.
  const stream = createReadStream(file)
  stream.once('open', () => {
    res.writeHead(status, headers)
    stream.pipe(res)
  })
  stream.once('error', () => {
    if (res.headersSent) return res.destroy()
    if (status === 404) return plain(res, 404, 'Not found')
    plain(res, 503, 'Could not read the export. If a build is running, retry when it finishes.')
  })
  // pipe() leaves the file open when the client goes away mid-download.
  res.once('close', () => stream.destroy())
}

function redirect(res, status, location) {
  res.writeHead(status, { Location: location })
  res.end()
}

function notFound(req, res) {
  send(req, res, 404, join(root, '404.html'))
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return plain(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' })
  }

  let url
  let pathname
  try {
    url = new URL(req.url, 'http://localhost')
    pathname = decodeURIComponent(url.pathname)
  } catch {
    return notFound(req, res)
  }

  // Redirects keep the query string, as GitHub Pages does, and are built from
  // the path as requested so an encoded slash can't turn into `//host`.
  if (pathname === '/' && basePath) return redirect(res, 302, `${basePath}/${url.search}`)
  if (pathname === basePath) return redirect(res, 301, `${basePath}/${url.search}`)
  if (!pathname.startsWith(`${basePath}/`)) return notFound(req, res)

  const target = resolve(join(root, pathname.slice(basePath.length)))
  if (target !== root && !target.startsWith(root + sep)) return notFound(req, res)

  if (isFile(target)) return send(req, res, 200, target)
  if (isDirectory(target) && isFile(join(target, 'index.html'))) {
    // trailingSlash: true — pages live at <path>/index.html.
    if (!pathname.endsWith('/')) return redirect(res, 301, `${url.pathname}/${url.search}`)
    return send(req, res, 200, join(target, 'index.html'))
  }
  notFound(req, res)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the other server or run \`PORT=<port> pnpm start\`.`)
  } else {
    console.error(`Could not start the preview server: ${err.message}`)
  }
  process.exit(1)
})

server.listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}${basePath}/`)
})
