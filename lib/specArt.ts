import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import type { SpecId } from '@/data/specs'

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png']

export function getSpecArt(id: SpecId): string | undefined {
  for (const ext of EXTENSIONS) {
    const file = path.join(process.cwd(), 'public', 'static', 'images', 'specs', `${id}.${ext}`)
    if (existsSync(file)) {
      const version = Math.round(statSync(file).mtimeMs)
      return `/static/images/specs/${id}.${ext}?v=${version}`
    }
  }
  return undefined
}
