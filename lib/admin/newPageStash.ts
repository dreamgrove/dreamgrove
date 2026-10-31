// A page created from /admin/select only exists once its PR is merged, so the
// editor picks its starting document up from session storage instead.

const NEW_PAGE_PREFIX = 'dreamgrove:new-page:v1:'

export function stashNewPage(filePath: string, document: string) {
  try {
    window.sessionStorage.setItem(NEW_PAGE_PREFIX + filePath, document)
  } catch {
    // Storage blocked
  }
}

export function readNewPage(filePath: string): string | null {
  try {
    return window.sessionStorage.getItem(NEW_PAGE_PREFIX + filePath)
  } catch {
    return null
  }
}

export function clearNewPage(filePath: string) {
  try {
    window.sessionStorage.removeItem(NEW_PAGE_PREFIX + filePath)
  } catch {
    // Nothing to clean up if storage is unavailable
  }
}
