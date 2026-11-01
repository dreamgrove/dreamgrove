// A page created from /cms only exists once its PR is merged, so the editor
// picks its starting document up from session storage instead.
import { readItem, removeItem, writeItem } from '@/lib/utils/storage'

const NEW_PAGE_PREFIX = 'dreamgrove:new-page:v1:'

export function stashNewPage(filePath: string, document: string) {
  writeItem(NEW_PAGE_PREFIX + filePath, document, 'session')
}

export function readNewPage(filePath: string): string | null {
  return readItem(NEW_PAGE_PREFIX + filePath, 'session')
}

export function clearNewPage(filePath: string) {
  removeItem(NEW_PAGE_PREFIX + filePath, 'session')
}
