export function Logo(props: React.ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      {...props}
      className={`inline-flex h-10 items-center ${props.className ?? ''}`}
      aria-hidden="true"
    />
  )
}
