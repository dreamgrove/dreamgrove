import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

export default function ThemeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={siteMetadata.theme}
      enableSystem
      themes={['light', 'dark', 'april-fools']}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
