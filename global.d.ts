// global.d.ts
/// <reference types="react/canary" />
interface Window {
  myTooltipLibrary: {
    initTooltips: () => void
    rewriteLinks: () => void
  }
}
