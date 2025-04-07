const remarkGroupCheckboxes = () => {
  return (tree) => {
    // Process the tree
    const visit = (node) => {
      if (!node.children) return

      // Find consecutive checkbox elements
      let checkboxes = []
      const newChildren = []

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]

        // Check if this is a checkbox
        if (
          (child.type === 'mdxJsxFlowElement' || child.type === 'mdxJsxTextElement') &&
          child.name === 'Checkbox'
        ) {
          // Add to our group of checkboxes
          checkboxes.push(child)
        } else {
          // If we've collected checkboxes and now found a non-checkbox,
          // wrap them and add to newChildren
          if (checkboxes.length > 0) {
            if (checkboxes.length > 1) {
              // Create a wrapper with grid classes for multiple checkboxes
              const wrapper = {
                type: 'mdxJsxFlowElement',
                name: 'div',
                attributes: [
                  {
                    type: 'mdxJsxAttribute',
                    name: 'className',
                    value: 'grid gap-4 grid-cols-2 w-full',
                  },
                ],
                children: [...checkboxes],
              }
              newChildren.push(wrapper)
            } else {
              // Just add the single checkbox without wrapping
              newChildren.push(checkboxes[0])
            }
            checkboxes = []
          }

          // Process child recursively if it has children
          if (child.children) {
            visit(child)
          }

          // Add the non-checkbox child
          newChildren.push(child)
        }
      }

      // Handle any remaining checkboxes at the end
      if (checkboxes.length > 0) {
        if (checkboxes.length > 1) {
          // Create a wrapper with grid classes for multiple checkboxes
          const wrapper = {
            type: 'mdxJsxFlowElement',
            name: 'div',
            attributes: [
              {
                type: 'mdxJsxAttribute',
                name: 'className',
                value: 'grid grid-cols-2 gap-4 w-full',
              },
            ],
            children: [...checkboxes],
          }
          newChildren.push(wrapper)
        } else {
          // Just add the single checkbox without wrapping
          newChildren.push(checkboxes[0])
        }
      }

      // Replace the node's children
      node.children = newChildren
    }

    visit(tree)
    return tree
  }
}

export default remarkGroupCheckboxes
