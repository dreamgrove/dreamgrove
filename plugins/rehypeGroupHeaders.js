const rehypeGroupHeaders = () => {
  return (tree) => {
    const newChildren = []
    let currentHeader = null

    tree.children.forEach((node) => {
      if (node.tagName === 'h1') {
        if (currentHeader) {
          newChildren.push(currentHeader)
        }
        currentHeader = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['header-group'], id: `container-${node.properties.id}` },
          children: [node],
        }
      } else if (currentHeader) {
        currentHeader.children.push(node)
      } else {
        newChildren.push(node)
      }
    })

    if (currentHeader) {
      newChildren.push(currentHeader)
    }

    tree.children = newChildren
  }
}

export default rehypeGroupHeaders
