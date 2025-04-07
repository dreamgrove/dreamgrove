import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Function to recursively scan directories for MDX files
function scanDirectory(
  dir: string,
  baseDir: string
): { path: string; name: string; relativeDirPath: string }[] {
  const items: { path: string; name: string; relativeDirPath: string }[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(baseDir, fullPath)

    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      items.push(...scanDirectory(fullPath, baseDir))
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      // Get the relative directory path (e.g., blog/balance becomes blog/balance)
      const relativeDirPath = path.dirname(relativePath)

      items.push({
        path: relativePath,
        name: entry.name,
        relativeDirPath,
      })
    }
  }

  return items
}

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), 'data')
    const items = scanDirectory(baseDir, baseDir)

    // Map to organize files by their top-level directory first
    const topLevelDirs = new Map<string, Set<string>>()
    const filesByDirectory = new Map<string, { path: string; name: string }[]>()

    // First, collect all top-level directories and their subdirectories
    items.forEach((item) => {
      const pathParts = item.relativeDirPath.split(path.sep)
      const topDir = pathParts[0] || 'root'

      // Keep track of all subdirectories within each top directory
      if (!topLevelDirs.has(topDir)) {
        topLevelDirs.set(topDir, new Set())
      }
      topLevelDirs.get(topDir)!.add(item.relativeDirPath)

      // Also group files by their full directory path
      if (!filesByDirectory.has(item.relativeDirPath)) {
        filesByDirectory.set(item.relativeDirPath, [])
      }

      filesByDirectory.get(item.relativeDirPath)!.push({
        path: item.path,
        name: item.name,
      })
    })

    // Now create the final grouping structure
    const groupedItems: Record<string, { path: string; name: string }[]> = {}

    // Process each top-level directory
    topLevelDirs.forEach((subdirs, topDir) => {
      // If there's only one subdirectory (itself), use the second-level directory as the group
      if (subdirs.size === 1) {
        const singleDir = [...subdirs][0]
        filesByDirectory.get(singleDir)!.forEach((file) => {
          // Use the last part of the path as the group
          const groupParts = singleDir.split(path.sep)
          const group = groupParts.length > 1 ? groupParts[groupParts.length - 1] : topDir

          if (!groupedItems[group]) {
            groupedItems[group] = []
          }
          groupedItems[group].push(file)
        })
      } else {
        // If there are multiple subdirectories, process each one
        subdirs.forEach((subdir) => {
          const files = filesByDirectory.get(subdir) || []
          if (files.length > 0) {
            // Create a group name that includes the top directory and the last part of the subdir
            const pathParts = subdir.split(path.sep)
            let group: string

            if (pathParts.length === 1) {
              // If it's just the top directory with no subdirs
              group = pathParts[0]
            } else {
              // Otherwise use the format "topdir/lastpart"
              group = `${pathParts[0]}/${pathParts[pathParts.length - 1]}`
            }

            if (!groupedItems[group]) {
              groupedItems[group] = []
            }

            groupedItems[group].push(...files)
          }
        })
      }
    })

    return NextResponse.json({ files: groupedItems })
  } catch (error) {
    console.error('Error scanning files:', error)
    return NextResponse.json({ error: 'Failed to scan files' }, { status: 500 })
  }
}
