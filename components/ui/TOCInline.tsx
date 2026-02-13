export interface TOCItem {
  value: string
  url: string
  depth: number
  children?: TOCItem[]
}

interface TOCInlineProps {
  toc: TOCItem[]
  fromHeading?: number
  toHeading?: number
  asDisclosure?: boolean
  exclude?: string | string[]
  collapse?: boolean
  ulClassName?: string
  liClassName?: string
}

function createNestedList(items: TOCItem[]): TOCItem[] {
  const nestedList: TOCItem[] = []
  const stack: TOCItem[] = []
  items.forEach((item) => {
    const newItem = { ...item }
    while (stack.length > 0 && stack[stack.length - 1].depth >= newItem.depth) {
      stack.pop()
    }
    const parent = stack.length > 0 ? stack[stack.length - 1] : null
    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newItem)
    } else {
      nestedList.push(newItem)
    }
    stack.push(newItem)
  })
  return nestedList
}

const TOCInline = ({
  toc,
  fromHeading = 1,
  toHeading = 6,
  asDisclosure = false,
  exclude = '',
  collapse = false,
  ulClassName = '',
  liClassName = '',
}: TOCInlineProps) => {
  const re = Array.isArray(exclude)
    ? new RegExp('^(' + exclude.join('|') + ')$', 'i')
    : new RegExp('^(' + exclude + ')$', 'i')

  const filteredToc = toc.filter(
    (heading) =>
      heading.depth >= fromHeading && heading.depth <= toHeading && !re.test(heading.value)
  )

  const createList = (items: TOCItem[] | undefined): React.ReactNode => {
    if (!items || items.length === 0) return null
    return (
      <ul className={ulClassName}>
        {items.map((item, index) => (
          <li key={index} className={liClassName}>
            <a href={item.url}>{item.value}</a>
            {createList(item.children)}
          </li>
        ))}
      </ul>
    )
  }

  const nestedList = createNestedList(filteredToc)

  return (
    <>
      {asDisclosure ? (
        <details open={!collapse}>
          <summary className="ml-6 pt-2 pb-2 text-xl font-bold">Table of Contents</summary>
          <div className="ml-6">{createList(nestedList)}</div>
        </details>
      ) : (
        createList(nestedList)
      )}
    </>
  )
}

export default TOCInline
