/**
 * Runs a light/dark switch inside a view transition, so the whole page
 * crossfades from one theme to the other instead of snapping.
 *
 * next-themes applies the theme class in an effect, after the state update
 * commits, so the transition waits for the class on <html> to change before it
 * captures the new frame. While it runs, <html> carries `data-theme-switch`:
 * the rules under "Theme switch" in tailwind.css use it to drop the named
 * groups that page navigation animates, which leaves one crossfade of the
 * full page.
 *
 * Without the View Transitions API, under reduced motion, or while a switch is
 * already running, the theme changes at once as before.
 */

/** Upper bound on the wait for the theme class, in case it never changes. */
const APPLY_TIMEOUT_MS = 250

export function switchThemeWithTransition(applyTheme: () => void) {
  const doc = document as Document & {
    startViewTransition?: (cb: () => Promise<void>) => { finished: Promise<void> }
  }
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!doc.startViewTransition || reduce || root.dataset.themeSwitch !== undefined) {
    applyTheme()
    return
  }

  root.dataset.themeSwitch = ''

  const transition = doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        const done = () => {
          observer.disconnect()
          clearTimeout(timer)
          resolve()
        }
        const observer = new MutationObserver(done)
        observer.observe(root, { attributes: true, attributeFilter: ['class'] })
        const timer = setTimeout(done, APPLY_TIMEOUT_MS)
        applyTheme()
      }),
  )

  transition.finished.finally(() => {
    delete root.dataset.themeSwitch
  })
}
