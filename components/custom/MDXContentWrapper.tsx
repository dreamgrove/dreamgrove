'use client'

import React, { useMemo } from 'react'

/**
 * A wrapper component to stabilize MDX content that contains dynamic components
 * This prevents React from re-creating components when parent state changes
 */
const MDXContentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Memoize the children to maintain stable references across renders
  const memoizedChildren = useMemo(() => children, [children])

  return <>{memoizedChildren}</>
}

export default MDXContentWrapper
