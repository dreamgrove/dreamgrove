import { visit } from 'unist-util-visit'

// Matches :color[text] where color is a word (red, blue) or a hex code (#ff6600).
// The bracketed content cannot contain a literal `]`.
const COLOR_REGEX = /:([a-zA-Z]+|#[0-9a-fA-F]{3,8})\[([^\]]+)\]/g

export default function remarkColor() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return

      const value = node.value
      const matches = [...value.matchAll(COLOR_REGEX)]
      if (!matches.length) return

      const newNodes = []
      let lastIndex = 0

      for (const match of matches) {
        const [full, color, text] = match
        const start = match.index
        const end = start + full.length

        if (lastIndex < start) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, start) })
        }

        newNodes.push({
          type: 'mdxJsxTextElement',
          name: 'Color',
          attributes: [{ type: 'mdxJsxAttribute', name: 'c', value: color }],
          children: [{ type: 'text', value: text }],
        })

        lastIndex = end
      }

      if (lastIndex < value.length) {
        newNodes.push({ type: 'text', value: value.slice(lastIndex) })
      }

      parent.children.splice(index, 1, ...newNodes)
      return [visit.SKIP, index + newNodes.length]
    })
  }
}
