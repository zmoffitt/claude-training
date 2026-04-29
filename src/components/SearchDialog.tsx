'use client'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'

import { focusRing } from '@/lib/focusRing'
import { navigation, type NavLinkItem } from '@/components/Navigation'

export const useSearchStore = create<{
  isOpen: boolean
  open: () => void
  close: () => void
}>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

interface IndexedItem {
  title: string
  href: string
  trail: string
}

interface SearchResult {
  title: string
  href: string
  excerpt?: string
  trail?: string
}

function buildIndex(): Array<IndexedItem> {
  const items: Array<IndexedItem> = []
  for (const group of navigation) {
    const walk = (links: Array<NavLinkItem>, ancestors: Array<string>) => {
      for (const link of links) {
        items.push({
          title: link.title,
          href: link.href,
          trail: [group.title, ...ancestors].join(' › '),
        })
        if (link.children) walk(link.children, [...ancestors, link.title])
      }
    }
    walk(group.links, [])
  }
  return items
}

function sanitizeExcerpt(html: string): string {
  return html
    .replace(/<mark>/gi, '\x00MARK_OPEN\x00')
    .replace(/<\/mark>/gi, '\x00MARK_CLOSE\x00')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\x00MARK_OPEN\x00/g, '<mark>')
    .replace(/\x00MARK_CLOSE\x00/g, '</mark>')
}

function scoreMatch(query: string, item: IndexedItem): number | null {
  const q = query.toLowerCase().trim()
  if (!q) return 0
  const title = item.title.toLowerCase()
  const href = item.href.toLowerCase()
  if (title.startsWith(q)) return 100
  if (title.includes(q)) return 80
  const words = title.split(/[\s:,&\-/]+/).filter(Boolean)
  if (words.some((w) => w.startsWith(q))) return 60
  if (href.includes(q)) return 40
  if (item.trail.toLowerCase().includes(q)) return 20
  return null
}

let pagefindInstance: any = null
let pagefindFailed = false

async function loadPagefind() {
  if (pagefindInstance) return pagefindInstance
  if (pagefindFailed) return null
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
    pagefindInstance = await (new Function(`return import("${basePath}/pagefind/pagefind.js")`)())
    return pagefindInstance
  } catch {
    pagefindFailed = true
    pagefindInstance = null
    return null
  }
}

export function SearchDialog() {
  const { isOpen, open, close } = useSearchStore()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const [results, setResults] = useState<Array<SearchResult>>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const index = useMemo(buildIndex, [])

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    const localFallback = () => {
      const fallbackResults = index
        .map((item) => ({ item, score: scoreMatch(q, item) }))
        .filter((r): r is { item: IndexedItem; score: number } => r.score !== null)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((r) => ({
          title: r.item.title,
          href: r.item.href,
          trail: r.item.trail,
        }))
      if (!cancelled) setResults(fallbackResults)
    }

    ;(async () => {
      try {
        const pagefind = await loadPagefind()
        if (cancelled) return

        if (pagefind) {
          const search = await pagefind.debouncedSearch(q, {}, 150)
          if (cancelled || !search) return

          const items = await Promise.all(
            search.results.slice(0, 8).map(async (r: any) => {
              const data = await r.data()
              return {
                title: data.meta?.title || 'Untitled',
                href: data.url.replace(/\.html$/, ''),
                excerpt: data.excerpt ? sanitizeExcerpt(data.excerpt) : undefined,
              }
            })
          )
          if (!cancelled) setResults(items)
        } else {
          localFallback()
        }
      } catch {
        localFallback()
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    })()

    return () => { cancelled = true }
  }, [query, index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open()
      } else if (e.key === '/' && !isOpen) {
        const target = e.target as HTMLElement | null
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return
        e.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isOpen])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelected(0)
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    setSelected(0)
  }, [query])

  const isEmptyQuery = !query.trim()
  const listLength = isEmptyQuery ? navigation.length : results.length

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, Math.max(0, listLength - 1)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (isEmptyQuery && navigation[selected]) {
        router.push(navigation[selected].links[0]?.href || '/')
        close()
      } else if (results[selected]) {
        router.push(results[selected].href)
        close()
      }
    }
  }

  return (
    <Dialog open={isOpen} onClose={close} className="relative z-50" transition>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      />
      <div className="fixed inset-0 flex items-start justify-center p-4 pt-[10vh]">
        <DialogPanel
          transition
          className="w-full max-w-xl overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-900/10 transition duration-150 data-closed:scale-[0.98] data-closed:opacity-0 data-enter:ease-out data-leave:ease-in dark:bg-zinc-900 dark:ring-white/10"
        >
          <div className="flex items-center gap-3 border-b border-zinc-900/10 px-4 dark:border-white/10">
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              className="size-5 shrink-0 stroke-zinc-400"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="9" r="6" />
              <path d="m14 14 4 4" />
            </svg>
            <input
              autoFocus
              type="search"
              placeholder="Search docs…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              aria-label="Search documentation"
              aria-activedescendant={listLength > 0 ? `search-result-${selected}` : undefined}
              aria-controls="search-results"
              className="w-full bg-transparent py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
            />
            <kbd className="hidden text-[10px] font-semibold tracking-wider text-zinc-500 sm:inline dark:text-zinc-400">
              ESC
            </kbd>
          </div>
          {query.trim() && results.length === 0 && !isSearching ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Nothing matches &ldquo;{query}&rdquo;.
              <br />
              <span className="text-xs">
                Try a broader term, or browse the sidebar.
              </span>
            </div>
          ) : !query.trim() ? (
            <div className="max-h-[50vh] overflow-y-auto py-3">
              <div className="flex items-center gap-2 px-4 pb-2">
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Try
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['CLAUDE.md', 'hooks', 'MCP', '/schedule'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuery(q)}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 transition hover:bg-violet-100 hover:text-violet-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-violet-500/20 dark:hover:text-violet-300"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
              <p className="px-4 pt-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Sections
              </p>
              <ul id="search-results" role="listbox">
                {navigation.map((group, gi) => (
                  <li key={group.title} role="option" id={`search-result-${gi}`} aria-selected={selected === gi}>
                    <Link
                      href={group.links[0]?.href || '#'}
                      onClick={close}
                      onMouseEnter={() => setSelected(gi)}
                      className={clsx(
                        'flex items-center gap-3 px-4 py-2.5 text-sm',
                        selected === gi
                          ? 'bg-violet-500 text-white'
                          : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                      )}
                    >
                      <span className="font-medium">{group.title}</span>
                      <span
                        className={clsx(
                          'text-xs',
                          selected === gi ? 'text-violet-200' : 'text-zinc-400 dark:text-zinc-500',
                        )}
                      >
                        {group.links.length} {group.links.length === 1 ? 'page' : 'pages'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul
              id="search-results"
              role="listbox"
              className="max-h-[50vh] overflow-y-auto py-2"
            >
              {results.map((r, i) => (
                <li key={r.href} role="option" id={`search-result-${i}`} aria-selected={selected === i}>
                  <Link
                    href={r.href}
                    onClick={close}
                    onMouseEnter={() => setSelected(i)}
                    className={clsx(
                      'block px-4 py-2.5 text-sm',
                      selected === i
                        ? 'bg-violet-500 text-white'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                    )}
                  >
                    <div className="font-medium">{r.title}</div>
                    {r.excerpt ? (
                      <div
                        className={clsx(
                          'mt-0.5 line-clamp-2 text-xs',
                          '[&_mark]:rounded-sm [&_mark]:bg-violet-200/60 [&_mark]:px-0.5 [&_mark]:text-inherit dark:[&_mark]:bg-violet-500/30',
                          selected === i
                            ? 'text-violet-100 [&_mark]:bg-violet-400/40 dark:[&_mark]:bg-violet-300/30'
                            : 'text-zinc-500 dark:text-zinc-400',
                        )}
                        dangerouslySetInnerHTML={{ __html: r.excerpt }}
                      />
                    ) : r.trail ? (
                      <div
                        className={clsx(
                          'truncate text-xs',
                          selected === i
                            ? 'text-violet-100'
                            : 'text-zinc-500 dark:text-zinc-500',
                        )}
                      >
                        {r.trail}
                      </div>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div
            aria-hidden="true"
            className="flex items-center justify-end gap-4 border-t border-zinc-900/5 bg-zinc-50 px-4 py-2 text-[10px] text-zinc-500 dark:border-white/5 dark:bg-zinc-900/60 dark:text-zinc-400"
          >
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10">↑</kbd>
              <kbd className="rounded bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10">↓</kbd>
              <span className="ml-1">navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10">↵</kbd>
              <span className="ml-1">select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-white px-1.5 py-0.5 font-sans text-[10px] font-semibold shadow-sm ring-1 ring-zinc-900/10 dark:bg-zinc-800 dark:ring-white/10">esc</kbd>
              <span className="ml-1">close</span>
            </span>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export function SearchButton({ className }: { className?: string }) {
  const open = useSearchStore((s) => s.open)
  const [modKey, setModKey] = useState('⌘')
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !/Mac/i.test(navigator.platform)) {
      setModKey('Ctrl')
    }
  }, [])
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search documentation"
      aria-keyshortcuts={modKey === '⌘' ? 'Meta+K' : 'Control+K'}
      className={clsx(
        'group flex h-11 items-center justify-center rounded-md transition',
        // icon-only on narrow viewports
        'size-11 hover:bg-zinc-900/5 dark:hover:bg-white/5',
        // pill with label + kbd hint on sm+
        'sm:w-auto sm:gap-2 sm:px-3 sm:ring-1 sm:ring-inset sm:ring-zinc-900/10 sm:hover:ring-zinc-900/20 sm:dark:ring-white/10 sm:dark:hover:ring-white/20',
        focusRing,
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-5 stroke-zinc-900 transition group-hover:stroke-zinc-500 dark:stroke-white dark:group-hover:stroke-zinc-300"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m14 14 4 4" />
      </svg>
      <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">
        Search
      </span>
      <kbd
        aria-hidden="true"
        className="hidden font-sans text-[10px] font-semibold tracking-wider text-zinc-400 sm:inline dark:text-zinc-500"
      >
        {modKey}K
      </kbd>
    </button>
  )
}
