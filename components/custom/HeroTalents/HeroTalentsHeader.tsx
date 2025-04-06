'use client'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { useState, useMemo, memo } from 'react'
import styles from './HeroTalents.module.css'
import dynamic from 'next/dynamic'
interface HeroTalentsHeaderProps {
  title: string
  id: string
  children: React.ReactNode
  titleClassName?: string
}

const DynamicHeroTalentsHeader = dynamic(() => import('./HeroTalent'), {
  loading: () => <div>Loading...</div>,
})

export default function HeroTalentsHeader({ title, id, children }: HeroTalentsHeaderProps) {
  // Pre-render the content to avoid detachment
  const content = useMemo(() => <div>{children}</div>, [children])

  return <DynamicHeroTalentsHeader title={title} id={id} content={content} />
}
