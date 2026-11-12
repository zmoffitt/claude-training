import clsx from 'clsx'

/**
 * The arrow that ends a link row: the home page's section list, a session
 * outline, the 404 page's sessions. It shows at rest in a quiet gray, so the
 * row reads as a link before a pointer reaches it and on a touch screen,
 * where there is no hover. Hover and keyboard focus take it to the
 * interaction color and move it a step forward. The row's link carries
 * `group`.
 */
export function RowArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        'shrink-0 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-violet-500 group-focus-visible:translate-x-0.5 group-focus-visible:text-violet-500 dark:text-zinc-500 dark:group-hover:text-violet-400 dark:group-focus-visible:text-violet-400',
        className,
      )}
    >
      &rarr;
    </span>
  )
}
