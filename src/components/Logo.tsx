export function Logo(props: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={`inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white ${props.className ?? ''}`}
    >
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-400 text-xs font-bold text-white">
        AI
      </span>
      Cloud AI Training
    </span>
  )
}
