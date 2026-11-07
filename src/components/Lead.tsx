import { brandVars, type BrandKey } from '@/lib/theme-colors'

/**
 * Run-in label for a paragraph ("The problem:", "The fix:"), colored on the
 * risk scale so a page of problem/fix pairs scans by color as well as by
 * bold: red = the problem, green = the fix, amber = why it happens.
 *
 *   <Lead tone="red">The problem:</Lead> Accepting AI-generated code…
 */
export function Lead({
  tone = 'neutral',
  children,
}: {
  tone?: BrandKey
  children: React.ReactNode
}) {
  return (
    <strong style={{ color: brandVars[tone].text }}>{children}</strong>
  )
}
