/**
 * Puts the "On this page" disclosure into each MDX page, below the title and
 * its one-line tagline, so a reader on a phone or a small laptop meets the
 * title first. A page that opens with `PageHero` gets it under the hero.
 *
 * The node it adds is `<InlineTableOfContents />`, which `mdx-components.tsx`
 * supplies. The two counts let the component draw its summary row in the
 * static HTML, so nothing moves when the page hydrates.
 */
const CLOSING_HEADING = 'where to go next'

function textOf(node) {
  if (typeof node.value === 'string') return node.value
  return (node.children ?? []).map(textOf).join('')
}

function isJsx(node, name) {
  return node?.type === 'mdxJsxFlowElement' && node.name === name
}

export default function remarkPageOutline() {
  return (tree) => {
    const nodes = tree.children
    const h2s = nodes.filter((node) => node.type === 'heading' && node.depth === 2)
    const jumpable = h2s.filter(
      (node) => textOf(node).trim().toLowerCase() !== CLOSING_HEADING,
    )

    let index = nodes.findIndex((node) => node.type === 'heading' && node.depth === 1)
    if (index !== -1) {
      index += 1
      if (isJsx(nodes[index], 'ReadTime')) index += 1
      if (nodes[index]?.type === 'paragraph') index += 1
    } else {
      index = nodes.findIndex((node) => isJsx(node, 'PageHero'))
      if (index === -1) return
      index += 1
    }

    nodes.splice(index, 0, {
      type: 'mdxJsxFlowElement',
      name: 'InlineTableOfContents',
      attributes: [
        { type: 'mdxJsxAttribute', name: 'total', value: String(h2s.length) },
        { type: 'mdxJsxAttribute', name: 'jumpable', value: String(jumpable.length) },
      ],
      children: [],
    })
  }
}
