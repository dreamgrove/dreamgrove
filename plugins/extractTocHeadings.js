import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import remarkMath from 'remark-math'

function remarkTocHeadings() {
  const slugger = new GithubSlugger()
  return (tree, file) => {
    const toc = []
    visit(tree, 'heading', (node) => {
      const textContent = toString(node)
      toc.push({
        value: textContent,
        url: '#' + slugger.slug(textContent),
        depth: node.depth,
      })
    })
    file.data.toc = toc
  }
}

// Parse as MDX like the page itself: plain markdown treats a heading right after
// a JSX block (no blank line between) as part of that block and drops it
export async function extractTocHeadings(markdown) {
  const vfile = await remark()
    .use(remarkMdx)
    .use(remarkMath)
    .use(remarkTocHeadings)
    .process(markdown)
  return vfile.data.toc
}
