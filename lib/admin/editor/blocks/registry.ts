// Registry of the custom MDX components a writer can insert from the editor's
// block menu. tags.ts finds them in a document, form.ts reads and writes their
// attributes, summary.ts describes them for rich mode's cards.

import { SPECS } from '@/data/specs'

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'bool'
  | 'select'
  | 'spell'
  | 'spells'
  | 'strings'
  | 'talentColors'
  | 'image'
  | 'table'

export interface Field {
  key: string
  label: string
  kind: FieldKind
  placeholder?: string
  help?: string
  required?: boolean
  mono?: boolean
  /** Textarea height in rows */
  rows?: number
  options?: { value: string; label: string }[]
  /** Autocomplete source for `strings` */
  suggest?: 'talents'
  /** Applied to text input before it's stored, e.g. YouTube URL → id */
  normalize?: (value: string) => string
  /** Takes the full form width */
  wide?: boolean
  /** Shown after the help text, opens in a new tab */
  link?: { href: string; label: string }
  section?: string
  /** Content between the opening and closing tags rather than an attribute */
  body?: boolean
}

export type BlockCategory =
  | 'Spells and Talents'
  | 'Structural'
  | 'Conditionals'
  | 'Spells & items'
  | 'Media'

export interface BlockDef {
  id: string
  label: string
  description: string
  category: BlockCategory
  fields: Field[]
  /** JSX tag written by this block (absent for markdown snippets) */
  tag?: string
  /** Other tag names that open the same form (BossCard <-> Encounter) */
  aliases?: string[]
  /** Paired tag that wraps content, vs. self-closing */
  wraps?: boolean
  /** Only offered in the block menu for pages whose path matches */
  pages?: RegExp
  /** Left out of the block menu */
  hidden?: boolean
  /** Builds the inserted text for snippets that aren't plain JSX tags */
  build?: (values: Values, selection: string) => string
}

export type Values = Record<string, unknown>

export type TalentColor = { color: string; nodes: string[] }

export const TALENT_COLORS = ['red', 'yellow', 'green', 'white', 'blue', 'purple', 'orange']

const SPEC_OPTIONS = SPECS.map((s) => ({ value: s.id, label: s.name }))

function youtubeId(value: string) {
  const m = value.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{6,})/)
  return m ? m[1] : value.trim()
}

export const BLOCKS: BlockDef[] = [
  {
    id: 'talents',
    tag: 'Talents',
    label: 'Talent tree',
    description: 'Displays a talent tree from an export string',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'name',
        label: 'Name',
        kind: 'text',
        placeholder: 'Class Tree Choices',
        wide: true,
        section: 'Build info',
      },
      {
        key: 'talents',
        label: 'Export string',
        kind: 'textarea',
        mono: true,
        rows: 2,
        required: true,
        wide: true,
        placeholder: 'In-game export string',
      },
      {
        key: 'comment',
        label: 'Comment',
        kind: 'textarea',
        rows: 1,
        wide: true,
        placeholder: 'Shown under the build name',
      },
      {
        key: 'forceTree',
        label: 'Show only',
        kind: 'select',
        section: 'Display options',
        options: [
          { value: '', label: 'All trees (switchable)' },
          { value: 'class', label: 'Class tree' },
          { value: 'spec', label: 'Spec tree' },
          { value: 'hero', label: 'Hero tree' },
          { value: 'full', label: 'Full tree' },
        ],
      },
      {
        key: 'defaultTree',
        label: 'Default tab',
        kind: 'select',
        options: [
          { value: '', label: 'Full (default)' },
          { value: 'Class', label: 'Class' },
          { value: 'Spec', label: 'Spec' },
          { value: 'Hero', label: 'Hero' },
        ],
      },
      { key: 'open', label: 'Expanded by default', kind: 'bool' },
      { key: 'hideCopy', label: 'Hide copy button', kind: 'bool' },
      { key: 'viewOnly', label: 'View only', kind: 'bool' },
      {
        key: 'colors',
        label: 'Highlighted nodes',
        kind: 'talentColors',
        section: 'Nodes',
        wide: true,
        help: 'Colour talent nodes by name, e.g. to mark flexible picks.',
      },
      {
        key: 'extra',
        label: 'Extra nodes',
        kind: 'strings',
        suggest: 'talents',
        wide: true,
        help: 'Shown as selected even if they are not in the string.',
      },
      {
        key: 'body',
        label: 'Optional body',
        kind: 'textarea',
        body: true,
        section: 'Body',
        wide: true,
        placeholder: 'Markdown shown under the comment',
        help: 'Written between <Talents> and </Talents>. Leave empty for a self-closing tag.',
      },
    ],
  },
  {
    id: 'timeline',
    tag: 'Timeline',
    label: 'Spell timeline',
    description: 'A row of spell icons in a sequence',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'spellIds',
        label: 'Spells, in cast order',
        kind: 'spells',
        required: true,
        wide: true,
        help: 'Search and press Enter to add each spell. Drag to reorder.',
      },
      { key: 'beta', label: 'Use beta tooltips', kind: 'bool' },
    ],
  },
  {
    id: 'planner',
    tag: 'PlannerEmbed',
    label: 'Planner embed',
    description: 'Embeds a timeline from the dreamgrove planner',
    category: 'Spells and Talents',
    fields: [
      {
        key: 'code',
        label: 'Share code',
        kind: 'textarea',
        mono: true,
        required: true,
        wide: true,
        placeholder: 'DG1AQ…',
        help: 'Copy the share code from the planner.',
        link: { href: '/planner', label: 'Open the planner' },
      },
    ],
  },
  {
    id: 'hero',
    tag: 'HeroTalentsHeader',
    label: 'Hero talent section',
    description: 'Collapsible element that matches the colour of the selected hero tree',
    category: 'Structural',
    wraps: true,
    fields: [
      {
        key: 'title',
        label: 'Title',
        kind: 'text',
        required: true,
        placeholder: 'Druid of the Claw',
      },
      {
        key: 'id',
        label: 'Hero tree',
        kind: 'select',
        required: true,
        options: [
          { value: 'generic', label: 'Generic' },
          { value: 'kotg', label: 'Keeper of the Grove' },
          { value: 'ec', label: "Elune's Chosen" },
          { value: 'dotc', label: 'Druid of the Claw' },
        ],
      },
    ],
  },
  {
    id: 'collapsible',
    tag: 'Collapsible',
    label: 'Collapsible',
    description: 'Section with a title that expands when clicked',
    category: 'Structural',
    wraps: true,
    fields: [
      { key: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'AoE Rotation' },
    ],
  },
  {
    id: 'callout',
    label: 'Callout',
    description: 'A note, a tip or a warning section',
    category: 'Structural',
    fields: [
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        options: ['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'].map((v) => ({
          value: v,
          label: v[0] + v.slice(1).toLowerCase(),
        })),
      },
      { key: 'text', label: 'Text', kind: 'textarea', wide: true },
    ],
    build: (v, sel) => {
      const text = String(v.text || sel || 'Text')
      return (
        `> [!${v.type || 'NOTE'}]\n` +
        text
          .split('\n')
          .map((l) => `> ${l}`)
          .join('\n')
      )
    },
  },
  {
    id: 'checkbox',
    tag: 'Checkbox',
    label: 'Conditional checkbox',
    description: 'Checkbox used to show or hide conditional blocks',
    category: 'Conditionals',
    fields: [
      { key: 'spellId', label: 'Spell', kind: 'spell', required: true, wide: true },
      { key: 'name', label: 'Display name', kind: 'text', placeholder: 'Keeper of the Grove' },
      {
        key: 'id',
        label: 'Toggle id',
        kind: 'text',
        mono: true,
        placeholder: 'Defaults to the spell id',
        help: 'Id used by conditional blocks to reference this checkbox',
      },
      {
        key: 'radio',
        label: 'Radio group',
        kind: 'text',
        placeholder: 'Optional',
        help: 'All checkboxes sharing this name will be mutually exclusive',
      },
      // No isIcon field: <Checkbox> always renders as an icon and ignores the prop
      { key: 'defaultCheck', label: 'Ticked by default', kind: 'bool' },
    ],
  },
  {
    id: 'conditional',
    label: 'Conditional block',
    description: 'Content displayed only when the corresponding checkbox is ticked',
    category: 'Conditionals',
    fields: [
      {
        key: 'when',
        label: 'Condition',
        kind: 'text',
        required: true,
        mono: true,
        wide: true,
        placeholder: 'Incarnation',
        help: 'One or more conditional checkbox ids. You can combine multiple ids with && and negate one with ~, e.g. Starweaver&&~Incarnation',
      },
      { key: 'text', label: 'Content', kind: 'textarea', wide: true },
    ],
    build: (v, sel) => `<div>[*${v.when}]\n\n${v.text || sel || 'Content'}\n\n</div>`,
  },
  {
    id: 'boss',
    tag: 'BossCard',
    aliases: ['Encounter'],
    label: 'Encounter',
    description: 'Boss or trash section for dungeon and raid pages.',
    category: 'Structural',
    wraps: true,
    fields: [
      { key: 'title', label: 'Title', kind: 'text', required: true, placeholder: 'Trash' },
      { key: 'trash', label: 'Trash pack', kind: 'bool' },
    ],
  },
  {
    id: 'specnote',
    tag: 'SpecNote',
    label: 'Spec note',
    // Needs the role selector, which only raid and dungeon pages render
    pages: /^(raids|dungeons)\//,
    description: 'Note for one spec, shown when that spec is picked in the role selector.',
    category: 'Structural',
    wraps: true,
    fields: [{ key: 'spec', label: 'Spec', kind: 'select', required: true, options: SPEC_OPTIONS }],
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Markdown table with a header',
    category: 'Structural',
    fields: [{ key: 'cells', label: '', kind: 'table', wide: true }],
    build: (v) => {
      const grid = (v.cells as string[][]) ?? []
      // A pipe or newline in a cell would break the row
      const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim() || ' '
      const line = (row: string[]) => '| ' + row.map(cell).join(' | ') + ' |'
      const [head = [], ...body] = grid
      return [line(head), line(head.map(() => '---')), ...body.map(line)].join('\n')
    },
  },
  {
    id: 'wowhead',
    tag: 'Wowhead',
    label: 'Wowhead link',
    description: 'Tooltip link to any Wowhead page: spells, items, NPCs.',
    category: 'Spells & items',
    hidden: true,
    fields: [
      {
        key: 'type',
        label: 'Type',
        kind: 'select',
        options: ['spell', 'item', 'npc', 'zone', 'achievement'].map((v) => ({
          value: v,
          label: v[0].toUpperCase() + v.slice(1),
        })),
      },
      { key: 'id', label: 'Id', kind: 'text', mono: true, placeholder: '8921' },
      { key: 'name', label: 'Display name', kind: 'text', placeholder: 'Moonfire' },
      { key: 'url', label: 'Custom URL', kind: 'text', placeholder: 'Optional', wide: true },
      { key: 'beta', label: 'Beta', kind: 'bool' },
      { key: 'noIcon', label: 'No icon', kind: 'bool' },
    ],
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Upload an image or use one already in /public.',
    category: 'Media',
    fields: [
      {
        key: 'src',
        label: 'Image',
        kind: 'image',
        required: true,
        mono: true,
        wide: true,
        placeholder: '/static/images/…',
        help: 'Uploads are committed alongside the page when you save.',
      },
      { key: 'alt', label: 'Description', kind: 'text', placeholder: 'A description of the image' },
    ],
    build: (v) => `![${v.alt || ''}](${v.src})`,
  },
  {
    id: 'youtube',
    tag: 'YouTube',
    label: 'YouTube video',
    description: 'Embedded video player.',
    category: 'Media',
    fields: [
      {
        key: 'id',
        label: 'Video URL or id',
        kind: 'text',
        required: true,
        normalize: youtubeId,
        wide: true,
        placeholder: 'https://youtu.be/…',
      },
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'start', label: 'Start at (seconds)', kind: 'number' },
    ],
  },
]

export const BY_TAG = new Map<string, BlockDef>()
for (const b of BLOCKS) {
  if (!b.tag) continue
  BY_TAG.set(b.tag, b)
  b.aliases?.forEach((a) => BY_TAG.set(a, b))
}

export const BLOCKS_BY_ID = new Map(BLOCKS.map((b) => [b.id, b]))
