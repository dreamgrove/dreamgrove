// Every icon on the site, by name. Add new ones to ICONS rather than importing
// react-icons (or drawing an SVG) in a component.
//
// Names without a suffix are the site's default glyphs (mostly Font Awesome).
// Variants of the same thing say how they're drawn: `Thin` is Lucide's light
// stroke, `Outline`/`Bold`/`Mini` are Heroicons.
import type { IconBaseProps, IconType } from 'react-icons'
import { BsLayoutSidebarInsetReverse } from 'react-icons/bs'
import { CiWarning } from 'react-icons/ci'
import {
  FaAngleDown,
  FaAngleUp,
  FaArrowLeft,
  FaBold,
  FaCheck,
  FaChevronDown,
  FaCode,
  FaDiscord,
  FaExternalLinkAlt,
  FaGithub,
  FaHistory,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaMagic,
  FaPen,
  FaPlus,
  FaQuoteRight,
  FaRegCheckSquare,
  FaRegCircle,
  FaRegDotCircle,
  FaRegQuestionCircle,
  FaRegSquare,
  FaSearch,
  FaStrikethrough,
  FaSyncAlt,
  FaTimes,
  FaUpload,
} from 'react-icons/fa'
import { FaCircleInfo } from 'react-icons/fa6'
import { FiPlusCircle } from 'react-icons/fi'
import {
  HiArrowUp,
  HiCheck,
  HiExclamationCircle,
  HiEye,
  HiMenu,
  HiOutlineChevronDown,
  HiOutlineClipboard,
  HiOutlineClipboardCheck,
  HiX,
} from 'react-icons/hi'
import { HiMiniChevronDown } from 'react-icons/hi2'
import { IoIosArrowDown } from 'react-icons/io'
import { IoLanguage } from 'react-icons/io5'
import {
  LuArrowDownToLine,
  LuArrowLeft,
  LuArrowRight,
  LuArrowUpToLine,
  LuCheck,
  LuChevronDown,
  LuExternalLink,
  LuEye,
  LuFileText,
  LuImage,
  LuPencil,
  LuSwords,
  LuUngroup,
  LuX,
} from 'react-icons/lu'
import { MdHorizontalRule, MdOutlineFormatColorText, MdWrapText } from 'react-icons/md'
import { PiCaretDoubleDownBold, PiCaretDoubleUpBold } from 'react-icons/pi'
import { TiDelete } from 'react-icons/ti'

const ICONS = {
  // Arrows and chevrons
  back: FaArrowLeft,
  arrowLeftThin: LuArrowLeft,
  arrowRightThin: LuArrowRight,
  arrowUpBold: HiArrowUp,
  angleDown: FaAngleDown,
  angleUp: FaAngleUp,
  chevron: FaChevronDown,
  chevronDownThin: LuChevronDown,
  chevronDownOutline: HiOutlineChevronDown,
  chevronDownMini: HiMiniChevronDown,
  arrowDown: IoIosArrowDown,
  caretDoubleUp: PiCaretDoubleUpBold,
  caretDoubleDown: PiCaretDoubleDownBold,

  // Actions
  close: FaTimes,
  closeThin: LuX,
  closeBold: HiX,
  delete: TiDelete,
  plus: FaPlus,
  plusCircle: FiPlusCircle,
  edit: FaPen,
  editThin: LuPencil,
  refresh: FaSyncAlt,
  search: FaSearch,
  upload: FaUpload,
  import: LuArrowDownToLine,
  export: LuArrowUpToLine,
  external: FaExternalLinkAlt,
  externalThin: LuExternalLink,
  copy: HiOutlineClipboard,
  copied: HiOutlineClipboardCheck,
  unwrap: LuUngroup,
  menu: HiMenu,
  details: BsLayoutSidebarInsetReverse,

  // Status
  check: FaCheck,
  checkThin: LuCheck,
  checkBold: HiCheck,
  info: FaCircleInfo,
  warning: CiWarning,
  alert: HiExclamationCircle,
  help: FaRegQuestionCircle,
  history: FaHistory,
  checkbox: FaRegSquare,
  checkboxChecked: FaRegCheckSquare,
  radio: FaRegCircle,
  radioChecked: FaRegDotCircle,
  eye: HiEye,
  eyeThin: LuEye,

  // Text formatting
  bold: FaBold,
  italic: FaItalic,
  strike: FaStrikethrough,
  code: FaCode,
  link: FaLink,
  list: FaListUl,
  olist: FaListOl,
  quote: FaQuoteRight,
  rule: MdHorizontalRule,
  color: MdOutlineFormatColorText,
  wrap: MdWrapText,
  spell: FaMagic,
  image: LuImage,

  // Things
  discord: FaDiscord,
  github: FaGithub,
  file: LuFileText,
  language: IoLanguage,
  swords: LuSwords,
} satisfies Record<string, IconType>

export type IconName = keyof typeof ICONS

/** The glyph component itself, e.g. to render it outside React */
export const iconGlyph = (name: IconName): IconType => ICONS[name]

// Material, Bootstrap and Feather glyphs carry their own padding; Font Awesome
// ones fill the box edge to edge, so in a `box` they're drawn smaller to match
const PADDED: ReadonlySet<IconName> = new Set([
  'rule',
  'color',
  'wrap',
  'details',
  'plusCircle',
  'image',
])
const FA_SCALE = 0.75

/**
 * An icon by name. Props go to the SVG (react-icons' `size`, `className`…),
 * so it sizes like text unless told otherwise. `box` instead draws it in a
 * `size`×`size` square with glyph sets evened out, for rows of toolbar icons.
 */
export default function Icon({
  name,
  box,
  size,
  ...props
}: IconBaseProps & { name: IconName; box?: boolean }) {
  const Glyph = ICONS[name]
  if (!box) return <Glyph aria-hidden size={size} {...props} />
  const px = typeof size === 'number' ? size : 18
  return (
    <span
      aria-hidden
      className="inline-flex flex-shrink-0 items-center justify-center"
      style={{ width: px, height: px }}
    >
      <Glyph size={PADDED.has(name) ? px : Math.round(px * FA_SCALE)} {...props} />
    </span>
  )
}
