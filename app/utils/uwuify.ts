/**
 * Transforms text into uwu-speak
 * @param text The input text to transform
 * @returns The uwu-ified version of the text
 */
export function uwuify(text: string): string {
  // Basic replacements
  const replacements: [RegExp, string][] = [
    [/[rl]/g, 'w'],
    [/[RL]/g, 'W'],
    [/n([aeiou])/g, 'ny$1'],
    [/N([aeiou])/g, 'Ny$1'],
    [/N([AEIOU])/g, 'NY$1'],
    [/th/g, 'd'],
    [/Th/g, 'D'],
    [/ove/g, 'uv'],
    [/!+/g, '! uwu'],
    [/\?+/g, '? owo'],
  ]

  // Apply all replacements
  let uwuText = text
  for (const [pattern, replacement] of replacements) {
    uwuText = uwuText.replace(pattern, replacement)
  }

  // Add random uwu faces with ~20% chance after punctuation
  uwuText = uwuText.replace(/([.!?]+\s+|$)/g, (match) => {
    const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^']
    return Math.random() < 0.2
      ? ` ${faces[Math.floor(Math.random() * faces.length)]}${match}`
      : match
  })

  return uwuText
}
