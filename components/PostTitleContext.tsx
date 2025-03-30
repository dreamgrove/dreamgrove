'use client'
import { createContext, useContext, ReactNode, useState } from 'react'

interface PostTitleContextType {
  title: string | null
  setTitle: (title: string | null) => void
}

const PostTitleContext = createContext<PostTitleContextType>({
  title: null,
  setTitle: () => {},
})

export const usePostTitle = () => useContext(PostTitleContext)

export const PostTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string | null>(null)

  return (
    <PostTitleContext.Provider value={{ title, setTitle }}>{children}</PostTitleContext.Provider>
  )
}
