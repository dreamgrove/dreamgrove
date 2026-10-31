import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { CONTENT_PATH_RE } from '@/lib/admin/content'
import { getContentAccess } from '@/lib/admin/access'

const DATA_DIR = path.join(process.cwd(), 'data')

// Anyone signed in can open a file in the editor; whether their save goes
// through a fork is decided in /api/compendium/save.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')

    if (!filePath) {
      return NextResponse.json({ error: 'Missing filePath parameter' }, { status: 400 })
    }

    // Only .mdx files inside data/, never ../ out of it
    const fullFilePath = path.resolve(DATA_DIR, filePath)
    if (!CONTENT_PATH_RE.test(filePath) || !fullFilePath.startsWith(DATA_DIR + path.sep)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 })
    }

    const access = await getContentAccess()
    if (!access) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // Tells the editor whether saving goes through the user's fork, and whether
    // they may create pages. Also sent with the 404, which the editor treats as a new page.
    const { canPush, canManage } = access

    if (!fs.existsSync(fullFilePath)) {
      return NextResponse.json({ error: 'File not found', canPush, canManage }, { status: 404 })
    }

    const content = fs.readFileSync(fullFilePath, 'utf8')

    return NextResponse.json({ content, canPush, canManage })
  } catch (error) {
    console.error('Error reading file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
