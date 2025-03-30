import { visit } from 'unist-util-visit'

export default function remarkSpell() {
  return (tree) => {
    // Process both list items and paragraphs
    visit(tree, (node) => {
      if (node.type === 'listItem' || node.type === 'paragraph') {
        const newChildren = []
        node.children.forEach((child, childIndex) => {
          if (child.type === 'text') {
            const value = child.value

            // Updated regex to better match the spell format
            const regex = /!(\d+\|)?([^!]+)!/g
            const matches = [...value.matchAll(regex)]
            if (matches.length) {
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
                  newChildren.push({
                    type: 'text',
                    value: text,
                  })
                }

                // Add space before if needed
                if (hasSpaceBefore) {
                  newChildren.push({
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

                newChildren.push({
                  type: 'mdxJsxFlowElement',
                  name: 'Wowhead',
                  attributes: attributes,
                  children: [],
                })

                // Add space after if needed
                if (hasSpaceAfter) {
                  newChildren.push({
                    type: 'text',
                    value: ' ',
                  })
                }

                lastIndex = end + (hasSpaceAfter ? 1 : 0)
              })

              // Add any remaining text after the last match
              if (lastIndex < value.length) {
                const text = value.slice(lastIndex)
                newChildren.push({
                  type: 'text',
                  value: text,
                })
              }
            } else {
              // If no matches, keep the original text node
              newChildren.push(child)
            }
          } else {
            // Keep non-text nodes as is
            newChildren.push(child)
          }
        })

        // Replace the node's children with the processed ones
        node.children = newChildren
      }
    })
  }
}
