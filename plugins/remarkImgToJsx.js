import { visit } from 'unist-util-visit'
import { sync } from 'probe-image-size'
import fs from 'fs'

export function remarkImgToJsx() {
  return (tree) => {
    visit(
      tree,
      (node) => node.type === 'paragraph' && node.children.some((n) => n.type === 'image'),
      (node) => {
        const imageNodeIndex = node.children.findIndex((n) => n.type === 'image')
        const imageNode = node.children[imageNodeIndex]
        if (fs.existsSync(`${process.cwd()}/public${imageNode.url}`)) {
          const dimensions = sync(fs.readFileSync(`${process.cwd()}/public${imageNode.url}`))
          imageNode.type = 'mdxJsxFlowElement'
          imageNode.name = 'Image'
          imageNode.attributes = [
            { type: 'mdxJsxAttribute', name: 'alt', value: imageNode.alt },
            { type: 'mdxJsxAttribute', name: 'src', value: imageNode.url },
            { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
            { type: 'mdxJsxAttribute', name: 'height', value: dimensions.height },
          ]
          node.type = 'div'
          node.children[imageNodeIndex] = imageNode
        }
      }
    )
  }
}
