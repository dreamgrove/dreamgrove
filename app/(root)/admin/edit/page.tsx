import { genPageMetadata } from 'app/(root)/seo'
import FileEditor from '@/components/admin/editor/FileEditor'
import { StatusMessage } from '@/components/admin/ui/StatusShell'

export const metadata = genPageMetadata({ title: 'Edit page' })

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; new?: string }>
}) {
  const { path, new: created } = await searchParams

  if (!path) {
    return (
      <StatusMessage
        title="No file selected"
        back={{ href: '/admin/select', label: 'Select a file' }}
      >
        This editor needs a file path to work on.
      </StatusMessage>
    )
  }

  // `new=1` is set by "New page" on /admin/select and the file only exists once its PR is merged.
  // This is keyed by path so switching files starts from a fresh editor.
  return <FileEditor key={path} filePath={path} isNew={created === '1'} />
}
