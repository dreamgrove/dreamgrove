import { genPageMetadata } from '@/lib/seo'
import FileBrowser from '@/components/admin/select/FileBrowser'
import { StatusMessage } from '@/components/admin/ui/StatusShell'
import { getContentAccess } from '@/lib/admin/access'

export const metadata = genPageMetadata({ title: 'Content editor' })

export default async function Page() {
  // Signed-out visitors get FileBrowser's sign-in prompt; signing in reloads this page
  const access = await getContentAccess().catch(() => null)
  if (access && !access.canManage) {
    return (
      <StatusMessage title="Members only" back={{ href: '/', label: 'Return home' }}>
        The page list is for dreamgrove members and contributors with write access. To suggest a
        change to a guide, open it on the site and use the pencil button in the bottom right.
      </StatusMessage>
    )
  }
  return <FileBrowser />
}
