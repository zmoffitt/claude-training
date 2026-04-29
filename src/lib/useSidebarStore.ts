import { create } from 'zustand'

const STORAGE_KEY = 'sidebar-config'
const DEFAULT_WIDTH = 320
const MIN_WIDTH = 240
const MAX_WIDTH = 480

interface SidebarState {
  width: number
  isCollapsed: boolean
  setWidth: (w: number) => void
  toggleCollapse: () => void
  expand: () => void
}

function load(): { width: number; isCollapsed: boolean } {
  if (typeof window === 'undefined') return { width: DEFAULT_WIDTH, isCollapsed: false }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        width: Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, parsed.width ?? DEFAULT_WIDTH)),
        isCollapsed: parsed.isCollapsed ?? false,
      }
    }
  } catch { /* ignore */ }
  return { width: DEFAULT_WIDTH, isCollapsed: false }
}

function save(state: { width: number; isCollapsed: boolean }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

export const useSidebarStore = create<SidebarState>()((set) => {
  const initial = load()
  return {
    ...initial,
    setWidth: (w: number) => {
      const clamped = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w))
      set({ width: clamped })
      save({ width: clamped, isCollapsed: false })
    },
    toggleCollapse: () =>
      set((state) => {
        const next = !state.isCollapsed
        save({ width: state.width, isCollapsed: next })
        return { isCollapsed: next }
      }),
    expand: () =>
      set((state) => {
        save({ width: state.width, isCollapsed: false })
        return { isCollapsed: false }
      }),
  }
})

export { MIN_WIDTH, MAX_WIDTH }
