// Content locale of a guide page. Korean guides are a path convention, not an i18n
// framework: they live under a `kr/` segment (data/blog/<spec>/kr/compendium.mdx).
// Everything else is English, which is also what an undefined locale means.
// The blog page and the admin preview both decide the locale here, so the preview
// always matches the published page.
export type PageLocale = 'en' | 'ko'

export function localeFromPath(path: string): PageLocale {
  return /(^|\/)kr\//.test(path) ? 'ko' : 'en'
}
