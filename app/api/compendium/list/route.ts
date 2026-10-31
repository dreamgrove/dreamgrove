import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ContentFile, ContentKind } from '@/lib/adminContent'

function scanDirectory(dir: string, baseDir: string): string[] {
  const files: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...scanDirectory(fullPath, baseDir))
    else if (entry.isFile() && entry.name.endsWith('.mdx'))
      files.push(path.relative(baseDir, fullPath).split(path.sep).join('/'))
  }
  return files
}

function kindOf(relPath: string): ContentKind {
  if (relPath.startsWith('dungeons/')) return 'dungeon'
  if (relPath.startsWith('raids/')) return 'raid'
  if (relPath.startsWith('blog/'))
    return relPath.endsWith('/compendium.mdx') ? 'compendium' : 'article'
  return 'page'
}

// gray-matter turns unquoted YAML dates into Date objects
const toDateString = (value: unknown) =>
  value instanceof Date ? value.toISOString().slice(0, 10) : value ? String(value) : undefined

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'data')
    const files: ContentFile[] = scanDirectory(baseDir, baseDir).map((relPath) => {
      let data: Record<string, any> = {}
      try {
        data = matter(fs.readFileSync(path.join(baseDir, relPath), 'utf8')).data
      } catch (err) {
        console.error(`Error parsing frontmatter of ${relPath}:`, err)
      }
      const name = path.posix.basename(relPath)
      const locale = relPath.split('/').find((seg) => seg === 'kr')
      return {
        path: relPath,
        name,
        kind: kindOf(relPath),
        title: data.title ? String(data.title) : name.replace(/\.mdx$/, ''),
        summary: data.summary ? String(data.summary) : undefined,
        specs: Array.isArray(data.specs) ? data.specs.map(String) : [],
        draft: data.draft === true,
        date: toDateString(data.lastmod) ?? toDateString(data.date),
        locale,
      }
    })

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Error scanning files:', error)
    return NextResponse.json({ error: 'Failed to scan files' }, { status: 500 })
  }
}
