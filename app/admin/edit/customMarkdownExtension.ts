import { MarkdownExtension, InlineParser, InlineContext } from '@lezer/markdown'
import { Tag, tags as defaultTags } from '@lezer/highlight'

// Define node types for our custom syntax
export const CustomInlineMark = 'CustomInlineMark'
export const CustomInlineElement = 'CustomInlineElement'
export const CustomInlineOperator = 'CustomInlineOperator'

// Define node types for our second custom syntax (!whatever!)
export const ExclamationMark = 'ExclamationMark'
export const ExclamationMarkPrimary = 'ExclamationMarkPrimary'
export const ExclamationMarkSecondary = 'ExclamationMarkSecondary'
export const ExclamationMarkSeparator = 'ExclamationMarkSeparator'

// Create Tags for highlighting - define them once as constants
// These are stable identities that won't change between renders
const CUSTOM_INLINE_TAG = Tag.define()
const CUSTOM_ELEMENT_TAG = Tag.define()
const CUSTOM_OPERATOR_TAG = Tag.define()
const EXCLAMATION_MARK_TAG = Tag.define()
const EXCLAMATION_MARK_PRIMARY_TAG = Tag.define()
const EXCLAMATION_MARK_SECONDARY_TAG = Tag.define()
const EXCLAMATION_MARK_SEPARATOR_TAG = Tag.define()

// Export the stable tag references
export const customInlineTag = CUSTOM_INLINE_TAG
export const customElementTag = CUSTOM_ELEMENT_TAG
export const customOperatorTag = CUSTOM_OPERATOR_TAG
export const exclamationMarkTag = EXCLAMATION_MARK_TAG
export const exclamationMarkPrimaryTag = EXCLAMATION_MARK_PRIMARY_TAG
export const exclamationMarkSecondaryTag = EXCLAMATION_MARK_SECONDARY_TAG
export const exclamationMarkSeparatorTag = EXCLAMATION_MARK_SEPARATOR_TAG

/**
 * Custom inline parser that matches [*whatever] patterns in markdown text
 * and distinguishes between elements and operators (|| and &&)
 */
const customInlineParser: InlineParser = {
  name: 'CustomInlineParser',
  // This will run before the default Link parser
  before: 'Link',

  parse(cx: InlineContext, next: number, pos: number): number {
    // Match [* at the start of the syntax
    if (next != 91 /* '[' */ || cx.char(pos + 1) != 42 /* '*' */) return -1

    // Find the closing bracket
    let end = pos + 2
    while (end < cx.end) {
      const char = cx.char(end)
      if (char == 93 /* ']' */) break
      end++
    }

    // If we didn't find a closing bracket, this isn't our syntax
    if (end == cx.end) return -1

    // Now parse the inside of [*...] to identify operators and elements
    let current = pos + 2 // Start after [*
    let tokenStart = current

    // Process the content between [* and ]
    while (current < end) {
      // Check for operators
      if (current + 1 < end) {
        // Check for ||
        if (cx.char(current) == 124 /* '|' */ && cx.char(current + 1) == 124 /* '|' */) {
          // If we have accumulated text before this operator, add it as an element
          if (tokenStart < current) {
            cx.addElement(cx.elt(CustomInlineElement, tokenStart, current))
          }
          // Add the operator
          cx.addElement(cx.elt(CustomInlineOperator, current, current + 2))
          current += 2
          tokenStart = current
          continue
        }

        // Check for &&
        if (cx.char(current) == 38 /* '&' */ && cx.char(current + 1) == 38 /* '&' */) {
          // If we have accumulated text before this operator, add it as an element
          if (tokenStart < current) {
            cx.addElement(cx.elt(CustomInlineElement, tokenStart, current))
          }
          // Add the operator
          cx.addElement(cx.elt(CustomInlineOperator, current, current + 2))
          current += 2
          tokenStart = current
          continue
        }
      }

      current++
    }

    // Add any remaining text as an element
    if (tokenStart < current) {
      cx.addElement(cx.elt(CustomInlineElement, tokenStart, current))
    }

    // Add the overall wrapper mark
    cx.addElement(cx.elt(CustomInlineMark, pos, end + 1))

    // Return the position after the closing bracket
    return end + 1
  },
}

/**
 * Second custom inline parser that matches !whatever! patterns in markdown text
 * with special handling for an optional | separator
 * example: !text! or !primary|secondary!
 */
const exclamationMarkParser: InlineParser = {
  name: 'ExclamationMarkParser',
  before: 'Emphasis', // Run before Emphasis parser to handle !text! before it would be interpreted as emphasis

  parse(cx: InlineContext, next: number, pos: number): number {
    // Match ! at the start of the syntax
    if (next != 33 /* '!' */) return -1

    // Check for a second exclamation immediately after (to avoid !! patterns)
    if (cx.char(pos + 1) === 33) return -1

    // Find the closing exclamation
    let end = pos + 1
    while (end < cx.end) {
      const char = cx.char(end)
      if (char == 33 /* '!' */) break
      end++
    }

    // If we didn't find a closing exclamation, this isn't our syntax
    if (end == cx.end) return -1

    // Check that there's content between the exclamations
    if (end <= pos + 1) return -1

    // Now check if there's a pipe separator
    let pipePos = -1
    for (let i = pos + 1; i < end; i++) {
      if (cx.char(i) === 124 /* '|' */) {
        pipePos = i
        break
      }
    }

    // Add the overall wrapper mark
    cx.addElement(cx.elt(ExclamationMark, pos, end + 1))

    if (pipePos !== -1) {
      // We have a separator, add primary and secondary parts
      if (pipePos > pos + 1) {
        // Add primary part (before the pipe)
        cx.addElement(cx.elt(ExclamationMarkPrimary, pos + 1, pipePos))
      }

      // Add the separator
      cx.addElement(cx.elt(ExclamationMarkSeparator, pipePos, pipePos + 1))

      if (pipePos + 1 < end) {
        // Add secondary part (after the pipe) - will be brighter
        cx.addElement(cx.elt(ExclamationMarkSecondary, pipePos + 1, end))
      }
    } else {
      // No separator, just add the whole content as primary
      cx.addElement(cx.elt(ExclamationMarkPrimary, pos + 1, end))
    }

    // Return the position after the closing exclamation
    return end + 1
  },
}

// Create a stable extension object that won't be recreated
const customMarkdownExtension: MarkdownExtension = {
  defineNodes: [
    { name: CustomInlineMark, style: customInlineTag },
    { name: CustomInlineElement, style: customElementTag },
    { name: CustomInlineOperator, style: customOperatorTag },
    { name: ExclamationMark, style: exclamationMarkTag },
    { name: ExclamationMarkPrimary, style: exclamationMarkPrimaryTag },
    { name: ExclamationMarkSecondary, style: exclamationMarkSecondaryTag },
    { name: ExclamationMarkSeparator, style: exclamationMarkSeparatorTag },
  ],
  parseInline: [customInlineParser, exclamationMarkParser],
}

export default customMarkdownExtension
