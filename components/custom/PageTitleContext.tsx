'use client'

import { createContext, useContext, ReactNode } from 'react'

const PageTitleContext = createContext<string | undefined>(undefined)

export function PageTitleProvider({ title, children }: { title: string; children: ReactNode }) {
  return <PageTitleContext.Provider value={title}>{children}</PageTitleContext.Provider>
}

export function usePageTitle() {
  return useContext(PageTitleContext)
}
