import { genPageMetadata } from 'app/(root)/seo'
import FileBrowser from '@/components/admin/select/FileBrowser'

export const metadata = genPageMetadata({ title: 'Content editor' })

export default function Page() {
  return <FileBrowser />
}
