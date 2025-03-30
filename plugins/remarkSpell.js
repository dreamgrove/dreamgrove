import { visit } from 'unist-util-visit'

export default function remarkSpell() {
  return (tree) => {
    // Skip processing blockquotes with alert markers
    visit(tree, 'blockquote', (node) => {
      if (node.children && node.children.length > 0) {
        const firstChild = node.children[0]

        // If the first child is a paragraph, check its content for alert markers
        if (
          firstChild.type === 'paragraph' &&
          firstChild.children &&
          firstChild.children.length > 0
        ) {
          const firstTextNode = firstChild.children[0]

          // If the first text contains an alert marker, skip processing this blockquote
          if (
            firstTextNode.type === 'text' &&
            (firstTextNode.value.includes('[!NOTE]') ||
              firstTextNode.value.includes('[!WARNING]') ||
              firstTextNode.value.includes('[!ERROR]') ||
              firstTextNode.value.includes('[!SUCCESS]') ||
              firstTextNode.value.includes('[!NOTE]') ||
              firstTextNode.value.includes('[!TIP]'))
          ) {
            // Mark this blockquote node to be skipped
            node.data = node.data || {}
            node.data.skip = true
          }
        }
      }
    })

    // Process all text nodes that are NOT inside marked alert blockquotes
    visit(tree, 'text', (node, index, parent) => {
      if (!parent) return

      // Skip if we're inside a blockquote that has been marked for skipping
      let ancestor = parent
      let skipProcessing = false

      while (ancestor) {
        if (ancestor.data && ancestor.data.skip) {
          skipProcessing = true
          break
        }
        ancestor = ancestor.parent
      }

      if (skipProcessing) return

      // Skip processing if this text directly contains alert marker
      if (
        node.value.includes('[!NOTE]') ||
        node.value.includes('[!WARNING]') ||
        node.value.includes('[!ERROR]') ||
        node.value.includes('[!SUCCESS]') ||
        node.value.includes('[!NOTE]') ||
        node.value.includes('[!TIP]')
      ) {
        return
      }

      // Skip if the parent or grandparent looks like it might be an alert container
      // (This covers cases where the blockquote visitor might have missed something)
      if (parent.type === 'paragraph' && parent.parent && parent.parent.type === 'blockquote') {
        return
      }

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
