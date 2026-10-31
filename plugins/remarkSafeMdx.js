import { visit } from 'unist-util-visit'

// MDX is code: an expression like {process.env.SECRET} is evaluated when the page is
// rendered, and JSX can carry event handlers. Content can be edited by anyone through
// the public CMS, so this limits guides to markup: the components we register, plain
// HTML, and attribute values that are literals. Runs first, before plugins that
// generate JSX of their own (remarkSpell, remarkColor).

// Keys of `components` in components/MDXComponents.tsx that guides may use
const COMPONENTS = new Set([
  'BossCard',
  'Changelog',
  'Checkbox',
  'Collapsible',
  'Color',
  'Encounter',
  'HeroTalentsHeader',
  'Image',
  'Npc',
  'PlannerEmbed',
  'SpecNote',
  'Talents',
  'Timeline',
  'TOCInline',
  'Wowhead',
  'YouTube',
])

const HTML = new Set(
  'a b blockquote br code del details div em h1 h2 h3 h4 h5 h6 hr i img kbd li ol p pre s small span strong sub summary sup table tbody td th thead tr u ul'.split(
    ' '
  )
)

const FORBIDDEN_ATTRS = new Set(['dangerouslySetInnerHTML', 'ref', 'style'])
const URL_ATTRS = new Set(['href', 'src', 'poster', 'cite', 'action', 'formAction', 'xlinkHref'])
const SAFE_SCHEMES = new Set(['http', 'https', 'mailto'])

/** Relative URLs, anchors, and http(s)/mailto links; never javascript:, data: and friends */
export function isSafeUrl(url) {
  // Browsers drop control characters and whitespace while parsing a scheme
  const cleaned = String(url)
    .replace(/[\u0000- \u007f]/g, '')
    .toLowerCase()
  const scheme = cleaned.match(/^([a-z][a-z0-9+.-]*):/)
  return !scheme || SAFE_SCHEMES.has(scheme[1])
}

/**
 * The value of an estree expression made only of literals: strings, numbers, booleans,
 * null, negative numbers, template strings without placeholders, and arrays/objects of
 * those. Throws on anything else (calls, identifiers, member access, spreads…).
 */
export function literalValue(node) {
  switch (node?.type) {
    case 'Literal':
      if (node.regex) break
      return node.value
    case 'TemplateLiteral':
      if (node.expressions.length) break
      return node.quasis.map((q) => q.value.cooked).join('')
    case 'UnaryExpression':
      if (
        node.operator === '-' &&
        node.argument.type === 'Literal' &&
        typeof node.argument.value === 'number'
      ) {
        return -node.argument.value
      }
      break
    case 'ArrayExpression':
      return node.elements.map((el) => {
        if (!el || el.type === 'SpreadElement') throw new Error('Spread or hole in array')
        return literalValue(el)
      })
    case 'ObjectExpression': {
      const out = {}
      for (const prop of node.properties) {
        if (prop.type !== 'Property' || prop.computed || prop.method || prop.kind !== 'init') {
          throw new Error('Only plain `key: value` properties are allowed')
        }
        const key = prop.key.type === 'Identifier' ? prop.key.name : prop.key.value
        out[key] = literalValue(prop.value)
      }
      return out
    }
  }
  throw new Error(`${node?.type ?? 'Empty expression'} is not allowed`)
}

/** literalValue for a whole `{…}` attribute value, given its estree Program */
export function programValue(program) {
  const [statement, ...rest] = program?.body ?? []
  if (rest.length || statement?.type !== 'ExpressionStatement') {
    throw new Error('Expected a single value')
  }
  return literalValue(statement.expression)
}

export default function remarkSafeMdx() {
  return (tree, file) => {
    const fail = (reason, node) => file.fail(`Not allowed in guides: ${reason}`, node)

    visit(tree, (node) => {
      switch (node.type) {
        case 'mdxjsEsm':
          if (isGeneratedFrontmatter(node)) return
          return fail('import/export statements', node)

        case 'mdxFlowExpression':
        case 'mdxTextExpression':
          // `{/* comments */}` parse to an empty program and are fine
          if (node.data?.estree?.body?.length) return fail(`the expression {${node.value}}`, node)
          return

        case 'link':
        case 'image':
        case 'definition':
          if (!isSafeUrl(node.url)) return fail(`the link ${node.url}`, node)
          return

        case 'mdxJsxFlowElement':
        case 'mdxJsxTextElement':
          return checkElement(node, fail)
      }
    })
  }
}

/**
 * contentlayer's bundler (mdx-bundler) runs remark-mdx-frontmatter before our plugins,
 * which adds `export const frontmatter = <YAML data>`. Unlike anything parsed from the
 * file, that node has no source position.
 */
function isGeneratedFrontmatter(node) {
  const [statement, ...rest] = node.data?.estree?.body ?? []
  const declarators = statement?.declaration?.declarations ?? []
  return (
    !node.position &&
    !rest.length &&
    statement.type === 'ExportNamedDeclaration' &&
    declarators.length === 1 &&
    declarators[0].id.name === 'frontmatter'
  )
}

function checkElement(node, fail) {
  // A fragment (<>…</>) has no name and can't carry attributes
  if (node.name !== null && !COMPONENTS.has(node.name) && !HTML.has(node.name)) {
    return fail(`the <${node.name}> tag`, node)
  }
  for (const attr of node.attributes) {
    if (attr.type !== 'mdxJsxAttribute') return fail('spread attributes ({...props})', node)
    if (/^on/i.test(attr.name) || FORBIDDEN_ATTRS.has(attr.name)) {
      return fail(`the ${attr.name} attribute`, node)
    }

    let value = attr.value
    if (value && typeof value === 'object') {
      try {
        value = programValue(value.data?.estree)
      } catch (err) {
        return fail(`${attr.name}={${value.value}} (${err.message}; use a literal value)`, node)
      }
    }
    if (URL_ATTRS.has(attr.name) && typeof value === 'string' && !isSafeUrl(value)) {
      return fail(`${attr.name}="${value}"`, node)
    }
  }
}
