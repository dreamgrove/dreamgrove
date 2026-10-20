// Content locale of a guide page. Korean guides are a path convention, not an i18n
// framework: they live under a `kr/` segment (data/blog/<spec>/kr/compendium.mdx).
// Everything else is English, which is also what an undefined locale means.
export type PageLocale = 'en' | 'ko'

export function localeFromPath(path: string): PageLocale {
  return path.includes('kr/') ? 'ko' : 'en'
}
