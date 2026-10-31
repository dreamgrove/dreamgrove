export interface RichHandlers {
  /** Opens the block form for the component whose opening tag starts at `pos` */
  editTag: (pos: number) => void
  /**
   * Opens the link popover for the markdown link spanning `from`–`to`. `at`
   * places it under a rendered link (viewport coords at the scroll position
   * `scrollTop`) when `from` has no text of its own, as inside a table.
   */
  openLink: (from: number, to: number, at?: LinkAnchor) => void
  /** Opens a snippet block's form (image, table); submitting replaces `from`–`to` */
  editSnippet: (blockId: string, values: Record<string, unknown>, from: number, to: number) => void
  /** Displayable URL for an image src (pending uploads live in blobs) */
  imageUrl: (src: string) => string
}

export type LinkAnchor = { left: number; bottom: number; scrollTop: number }

export type HandlersRef = { readonly current: RichHandlers }
