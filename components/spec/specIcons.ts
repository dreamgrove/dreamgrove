import type { StaticImageData } from 'next/image'
import type { SpecId } from '@/data/specs'
import balanceIcon from '../../public/static/images/icons/balance.jpg'
import feralIcon from '../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../public/static/images/icons/guardian.jpg'
import restoIcon from '../../public/static/images/icons/resto.jpg'

/** Square spec icons, for next/image */
export const SPEC_ICONS: Record<SpecId, StaticImageData> = {
  balance: balanceIcon,
  feral: feralIcon,
  guardian: guardianIcon,
  resto: restoIcon,
}
