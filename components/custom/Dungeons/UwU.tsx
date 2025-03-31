import { uwuify } from 'app/utils/uwuify'
import React from 'react'

export default function UwU({ children }) {
  // Recursively transform text content in React children
  const uwuifyChildren = (child) => {
    // If the child is a string, uwuify it
    if (typeof child === 'string' && child !== '' && child !== ' ' && child !== '\n') {
      return uwuify(child)
    }

    // If the child is an array, map through its elements
    if (Array.isArray(child)) {
      return child.map(uwuifyChildren)
    }

    // If the child is a React element, clone it with transformed children
    if (child?.props?.children) {
      return React.cloneElement(child, {
        ...child.props,
        children: uwuifyChildren(child.props.children),
      })
    }

    // Return unchanged if none of the above
    return child
  }

  return uwuifyChildren(children)
}
