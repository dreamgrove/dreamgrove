import HeroTalents from './HeroTalents'
interface HeroTalentsHeaderProps {
  title: string
  id: string
  children: React.ReactNode
  titleClassName?: string
}

export default function HeroTalentsHeader({ title, id, children }: HeroTalentsHeaderProps) {
  return (
    <HeroTalents title={title} id={id}>
      {children}
    </HeroTalents>
  )
}
