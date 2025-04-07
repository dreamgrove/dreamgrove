import dynamic from 'next/dynamic'
interface HeroTalentsHeaderProps {
  title: string
  id: string
  children: React.ReactNode
  titleClassName?: string
}

const DynamicHeroTalentsHeader = dynamic(() => import('./HeroTalents'), {
  loading: () => <div>Loading...</div>,
})

export default function HeroTalentsHeader({ title, id, children }: HeroTalentsHeaderProps) {
  return (
    <DynamicHeroTalentsHeader title={title} id={id}>
      {children}
    </DynamicHeroTalentsHeader>
  )
}
