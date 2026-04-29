'use client'

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Suspense, createContext, useContext } from 'react'
import { create } from 'zustand'

import { Header } from '@/components/Header'
import { MenuIcon, XIcon } from '@/components/NavIcons'
import { Navigation } from '@/components/Navigation'
import { focusRing } from '@/lib/focusRing'

const IsInsideMobileNavigationContext = createContext(false)

function MobileNavigationDialog({
  isOpen,
  close,
}: {
  isOpen: boolean
  close: () => void
}) {
  return (
    <Dialog
      transition
      open={isOpen}
      onClose={close}
      className="fixed inset-0 z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-xs data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-black/40"
      />

      <DialogPanel>
        <TransitionChild>
          <Header className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />
        </TransitionChild>

        <TransitionChild>
          <motion.div
            layoutScroll
            className="fixed top-14 bottom-0 left-0 w-full overflow-y-auto bg-white px-4 pt-6 pb-4 shadow-lg ring-1 shadow-zinc-900/10 ring-zinc-900/7.5 duration-500 ease-in-out data-closed:-translate-x-full sm:max-w-md sm:px-6 sm:pb-10 dark:bg-zinc-900 dark:ring-zinc-800"
          >
            <Navigation />
          </motion.div>
        </TransitionChild>
      </DialogPanel>
    </Dialog>
  )
}

export function useIsInsideMobileNavigation() {
  return useContext(IsInsideMobileNavigationContext)
}

export const useMobileNavigationStore = create<{
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}>()((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))

export function MobileNavigation() {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let { isOpen, toggle, close } = useMobileNavigationStore()
  let ToggleIcon = isOpen ? XIcon : MenuIcon

  return (
    <IsInsideMobileNavigationContext.Provider value={true}>
      <button
        type="button"
        className={clsx(
          'relative flex size-11 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5',
          focusRing,
        )}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <ToggleIcon className="w-3 stroke-zinc-900 dark:stroke-white" />
      </button>
      {!isInsideMobileNavigation && (
        <Suspense fallback={null}>
          <MobileNavigationDialog isOpen={isOpen} close={close} />
        </Suspense>
      )}
    </IsInsideMobileNavigationContext.Provider>
  )
}
