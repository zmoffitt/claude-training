/**
 * The `aria-level` for a card title, which is an <h3>.
 *
 * `scripts/remark-card-heading-level.mjs` passes each card set the level its
 * titles hold in the page outline. Level 3 is what the element already says,
 * so it needs no attribute; anything else is announced through `aria-level`.
 */
export function titleLevel(level?: number | string): number | undefined {
  const n = Number(level)
  return Number.isInteger(n) && n >= 1 && n <= 6 && n !== 3 ? n : undefined
}
