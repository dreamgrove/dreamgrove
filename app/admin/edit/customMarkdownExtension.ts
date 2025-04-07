import { MarkdownExtension, InlineParser, InlineContext } from '@lezer/markdown'
import { Tag, tags as t } from '@lezer/highlight'

// Define node types for our custom syntax
export const CustomInlineMark = 'CustomInlineMark'
export const CustomInlineElement = 'CustomInlineElement'
export const CustomInlineOperator = 'CustomInlineOperator'

// Define node types for our second custom syntax (!whatever!)
export const ExclamationMark = 'ExclamationMark'
export const ExclamationMarkPrimary = 'ExclamationMarkPrimary'
export const ExclamationMarkSecondary = 'ExclamationMarkSecondary'
export const ExclamationMarkSeparator = 'ExclamationMarkSeparator'

/**
 * Custom inline parser that matches [*whatever] patterns in markdown text
 * and distinguishes between elements and operators (|| and &&)
 */
const customInlineParser: InlineParser = {
  name: 'CustomInlineParser',
  // Run this parser before the Emphasis parser to ensure our syntax is prioritized
  before: 'Emphasis',

  parse(cx: InlineContext, next: number, pos: number): number {
    // Match [* at the start of the syntax
    if (next != 91 /* '[' */ || cx.char(pos + 1) != 42 /* '*' */) return -1

    // Find the closing bracket
    let end = pos + 2
    while (end < cx.end) {
      const char = cx.char(end)
      if (char == 10 /* '\n' */) return -1
      if (char == 93 /* ']' */) break
      end++
    }

    // If we didn't find a closing bracket, this isn't our syntax
    if (end == cx.end) return -1

    // Add the opening [* mark
    const elements: any[] = [cx.elt(CustomInlineMark, pos, pos + 2)]

    // Now parse the inside of [*...] to identify operators and elements
    let current = pos + 2 // Start after [*
    let tokenStart = current

    // Process the content between [* and ]
    while (current < end) {
      // Check for operators
      if (current + 1 < end) {
        // Check for || or &&
        if (
          (cx.char(current) == 124 /* '|' */ && cx.char(current + 1) == 124) /* '|' */ ||
          (cx.char(current) == 38 /* '&' */ && cx.char(current + 1) == 38) /* '&' */
        ) {
          // If we have accumulated text before this operator, add it as an element
          if (tokenStart < current) {
            const element = cx.text.slice(tokenStart, current)
            elements.push(cx.elt(CustomInlineElement, tokenStart, current))
          }

          // Add the operator
          const operator = cx.text.slice(current, current + 2)
          elements.push(cx.elt(CustomInlineOperator, current, current + 2))

          current += 2
          tokenStart = current
          continue
        }
      }

      current++
    }

    // Add any remaining text as an element
    if (tokenStart < current) {
      const finalElement = cx.text.slice(tokenStart, current)
      elements.push(cx.elt(CustomInlineElement, tokenStart, current))
    }

    // Add the closing ] mark
    elements.push(cx.elt(CustomInlineMark, end, end + 1))

    // Create the combined element with all children
    return cx.addElement(cx.elt('CustomInline', pos, end + 1, elements))
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
      if (char == 10 /* '\n' */) return -1
      if (char == 33 /* '!' */) break
      end++
    }

    // If we didn't find a closing exclamation, this isn't our syntax
    if (end == cx.end) return -1

    // Check that there's content between the exclamations
    if (end <= pos + 1) return -1

    // Create the elements array
    const elements: any[] = []

    // Now check if there's a pipe separator
    let pipePos = -1
    for (let i = pos + 1; i < end; i++) {
      if (cx.char(i) === 124 /* '|' */) {
        pipePos = i
        break
      }
    }

    if (pipePos !== -1) {
      // We have a separator, add primary and secondary parts
      if (pipePos > pos + 1) {
        // Add primary part (before the pipe)
        elements.push(cx.elt(ExclamationMarkPrimary, pos + 1, pipePos))
      }

      // Add the separator
      elements.push(cx.elt(ExclamationMarkSeparator, pipePos, pipePos + 1))

      if (pipePos + 1 < end) {
        // Add secondary part (after the pipe) - will be brighter
        elements.push(cx.elt(ExclamationMarkSecondary, pipePos + 1, end))
      }
    } else {
      // No separator, just add the whole content as primary
      elements.push(cx.elt(ExclamationMarkSecondary, pos + 1, end))
    }

    // Return the composite element
    return cx.addElement(cx.elt(ExclamationMark, pos, end + 1, elements))
  },
}

// Create a stable extension object that won't be recreated
const customMarkdownExtension: MarkdownExtension = {
  defineNodes: [
    { name: 'CustomInline', style: t.special(t.content) },
    { name: CustomInlineMark, style: t.processingInstruction },
    { name: CustomInlineElement, style: t.bool },
    { name: CustomInlineOperator, style: t.operator },
    { name: ExclamationMark, style: t.special(t.content) },
    { name: ExclamationMarkPrimary, style: t.number },
    { name: ExclamationMarkSecondary, style: t.strong },
    { name: ExclamationMarkSeparator, style: t.separator },
  ],
  parseInline: [customInlineParser, exclamationMarkParser],
}

export default customMarkdownExtension
