import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { toString } from 'mdast-util-to-string'
import { remark } from 'remark'

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

export async function extractTocHeadings(markdown) {
  const vfile = await remark().use(remarkTocHeadings).process(markdown)
  return vfile.data.toc
}
