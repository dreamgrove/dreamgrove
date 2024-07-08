import { visit } from 'unist-util-visit'

export default function remarkSpell() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      const value = node.value
      const regex = /!(\d+\|)?(.*?)!/g
      const matches = [...value.matchAll(regex)]

      if (matches.length) {
        const newNodes = []
        let lastIndex = 0

        matches.forEach((match) => {
          const start = match.index
          const end = start + match[0].length
          const [fullMatch, id, spellName] = match

          if (lastIndex < start) {
            newNodes.push({
              type: 'text',
              value: value.slice(lastIndex, start),
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

          lastIndex = end
        })

        if (lastIndex < value.length) {
          newNodes.push({
            type: 'text',
            value: value.slice(lastIndex),
          })
        }

        parent.children.splice(index, 1, ...newNodes)
      }
    })
  }
}
