const isProduction = process.env.NODE_ENV === 'production'

export function sortPosts(allBlogs, dateKey = 'date') {
  return allBlogs.sort((a, b) => {
    if (a[dateKey] > b[dateKey]) return -1
    if (a[dateKey] < b[dateKey]) return 1
    return 0
  })
}

export function coreContent(content) {
  const result = Object.assign({}, content)
  delete result['body']
  delete result['_raw']
  delete result['_id']
  return result
}

export function allCoreContent(contents) {
  if (isProduction)
    return contents.map((c) => coreContent(c)).filter((c) => !('draft' in c && c.draft === true))
  return contents.map((c) => coreContent(c))
}
