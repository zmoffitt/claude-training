import clsx from 'clsx'

import { siteName } from '@/lib/site'

/**
 * The site wordmark: the program name in the display face. The last word is
 * set lighter and grayer, so the name reads as a lockup and not as one more
 * navigation heading.
 */
export function Logo({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'span'>) {
  const split = siteName.lastIndexOf(' ')
  const lead = split === -1 ? siteName : siteName.slice(0, split)
  const tail = split === -1 ? '' : siteName.slice(split + 1)

  return (
    <span
      {...props}
      className={clsx('inline-flex h-10 items-center', className)}
    >
      <span className="font-display text-[1.0625rem] leading-none font-bold tracking-tight whitespace-nowrap text-zinc-900 dark:text-white">
        {lead}
        {tail && (
          <>
            {' '}
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              {tail}
            </span>
          </>
        )}
      </span>
    </span>
  )
}
