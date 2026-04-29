import clsx from 'clsx'

/**
 * Dramatic landing-page hero: extreme size jump from body (text-sm ≈ 14px)
 * to display h1 (text-5xl/6xl ≈ 48–60px), paired with a light-weight subtitle.
 * Opts out of `.prose` defaults via `not-prose` so the title can break past
 * the 24px prose h1.
 *
 * Use on landing pages only — docs pages should keep the restrained prose h1
 * so content scanning stays fast.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={clsx('not-prose relative mt-2 mb-12 flex flex-col gap-4', className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-500 dark:text-violet-400">
          {eyebrow}
        </p>
      )}
      <h1
        className="text-balance break-words text-4xl font-extrabold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="max-w-2xl text-pretty break-words text-lg font-light leading-relaxed text-zinc-600 sm:text-xl dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}
