import { visit } from 'unist-util-visit'

const ALERT_MARKERS = ['[!NOTE]', '[!TIP]', '[!WARNING]', '[!ERROR]', '[!SUCCESS]']

export default function remarkSpell() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return

      // remarkAlert runs first and consumes GitHub's alert markers; this only
      // leaves `!…!` alone in text that still carries one (e.g. `[!ERROR]`)
      if (ALERT_MARKERS.some((marker) => node.value.includes(marker))) return

      // Now process any spell tags
      const value = node.value
      const regex = /!(\d+\|)?([^!]+)!/g
      const matches = [...value.matchAll(regex)]

      if (matches.length) {
        const newNodes = []
        let lastIndex = 0

        matches.forEach((match) => {
          const start = match.index
          const end = start + match[0].length
          const [fullMatch, id, spellName] = match

          // Check for spaces before and after the match
          const hasSpaceBefore = start > 0 && value[start - 1] === ' '
          const hasSpaceAfter = end < value.length && value[end] === ' '

          // Handle text before the match
          if (lastIndex < start) {
            const text = value.slice(lastIndex, start)
            newNodes.push({
              type: 'text',
              value: text,
            })
          }

          // Add space before if needed
          if (hasSpaceBefore) {
            newNodes.push({
              type: 'text',
              value: ' ',
            })
          }

          const attributes = []
          if (id) {
            attributes.push({
              type: 'mdxJsxAttribute',
              name: 'id',
              value: id.slice(0, -1), // remove the trailing '|'
            })
          }
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'name',
            value: spellName,
          })
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'type',
            value: 'spell',
          })

          newNodes.push({
            type: 'mdxJsxFlowElement',
            name: 'Wowhead',
            attributes: attributes,
            children: [],
          })

          // Add space after if needed
          if (hasSpaceAfter) {
            newNodes.push({
              type: 'text',
              value: ' ',
            })
          }

          lastIndex = end + (hasSpaceAfter ? 1 : 0)
        })

        // Add any remaining text after the last match
        if (lastIndex < value.length) {
          const text = value.slice(lastIndex)
          newNodes.push({
            type: 'text',
            value: text,
          })
        }

        // Replace the current node with the new nodes
        parent.children.splice(index, 1, ...newNodes)
        return [visit.SKIP, index + newNodes.length - 1]
      }
    })
  }
}
