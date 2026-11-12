/**
 * Tells each card set where it sits in the page's heading outline.
 *
 * A card title is an <h3>. Under a "## Section" that is the right level, but a
 * card set placed straight under the page title makes the outline jump from
 * level 1 to level 3, and a screen reader's heading list shows the gap. This
 * plugin passes `headingLevel` (one more than the nearest heading above the
 * card set) to the components named below, and they put it on the title as
 * `aria-level`. The element and its look do not change. A page can still set
 * `headingLevel` itself, and that wins.
 */
const CARD_SETS = new Set([
  'ComparisonCards',
  'EffortScale',
  'FeatureColumns',
  'ModelTierCards',
  'PermissionModel',
  'PillarCards',
  'ProConCards',
  'StackedFeatures',
])

export default function remarkCardHeadingLevel() {
  return (tree) => {
    // Before the first heading a card set is directly under the page title,
    // whether that title is a Markdown "#" or the hero's <h1>.
    let depth = 1

    const visit = (nodes) => {
      for (const node of nodes) {
        if (node.type === 'heading') {
          depth = node.depth
        } else if (node.type === 'mdxJsxFlowElement') {
          const given = node.attributes.some((attribute) => attribute.name === 'headingLevel')
          if (CARD_SETS.has(node.name) && !given) {
            node.attributes.push({
              type: 'mdxJsxAttribute',
              name: 'headingLevel',
              value: String(Math.min(depth + 1, 6)),
            })
          }
          if (node.children?.length) visit(node.children)
        }
      }
    }

    visit(tree.children)
  }
}
