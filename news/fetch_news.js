const RSSParser = require('rss-parser')
const puppeteer = require('puppeteer')
const TurndownService = require('turndown')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const rssUrl = 'https://www.wowhead.com/blue-tracker?rss'
const outputFilePath = path.join(__dirname, '../news/druid.md')
const lastBuildDatePath = path.join(__dirname, 'lastBuildDate.txt')

const parser = new RSSParser()
const turndownService = new TurndownService()

// Function to generate a hash from a string
const generateHash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex')
}

;(async () => {
  try {
    // Fetch the RSS feed
    const feed = await parser.parseURL(rssUrl)
    const lastBuildDate = new Date(feed.lastBuildDate)

    // Check the locally saved lastBuildDate
    let savedLastBuildDate = new Date(0) // Default to epoch if not found

    if (fs.existsSync(lastBuildDatePath)) {
      const savedDateStr = fs.readFileSync(lastBuildDatePath, 'utf8')
      savedLastBuildDate = new Date(savedDateStr)
    }

    // Compare dates
    if (lastBuildDate > savedLastBuildDate) {
      console.log('New updates found, executing script.')

      // Update the lastBuildDate.txt with the new date
      fs.writeFileSync(lastBuildDatePath, lastBuildDate.toISOString(), 'utf8')

      // Launch Puppeteer
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // Start with the metadata at the top of the file
      let allContent = `---
title: "Changelog"
summary: "A list of the latest class updates"
---

`

      const visitedHashes = new Set() // Set to track visited content hashes

      // Iterate over each item in the RSS feed
      for (const item of feed.items) {
        const title = item.title

        console.log(`Checking: ${item.link}`)
        await page.goto(item.link, { waitUntil: 'domcontentloaded' })

        // Check for <ul> > <li> > <strong> containing "DRUID"
        const druidElement = await page.evaluate(() => {
          const ulElements = document.querySelectorAll('ul')
          for (const ul of ulElements) {
            const liElements = ul.querySelectorAll('li')
            for (const li of liElements) {
              const strongTag = li.querySelector('strong')
              if (strongTag && strongTag.textContent.toUpperCase().includes('DRUID')) {
                return li.outerHTML
              }
            }
          }
          return null
        })

        if (druidElement) {
          // Convert the found HTML element to Markdown
          const markdownContent = turndownService.turndown(druidElement)

          // Generate a hash of the markdown content
          const contentHash = generateHash(markdownContent)

          // Check if this content hash has already been visited
          if (visitedHashes.has(contentHash)) {
            console.log(`Skipping duplicate content for: ${title}`)
            continue
          }

          // Extract the publication date and link
          const pubDate = item.pubDate
          const link = item.link

          // Combine the publication date, title, and Markdown content
          const combinedContent = `## ${pubDate}\n\nWith [${title}](${link})\n\n${markdownContent}\n\n`

          // Accumulate the content
          allContent += combinedContent

          // Mark this content hash as visited
          visitedHashes.add(contentHash)

          console.log('Druid element found and added to content.')
        }
      }

      if (allContent) {
        // Save all the accumulated content to druid.md
        fs.writeFileSync(outputFilePath, allContent, 'utf8')
        console.log('All content saved to druid.md')
      } else {
        console.log('No <strong>DRUID</strong> found in any of the RSS feed items.')
      }

      // Close Puppeteer
      await browser.close()

      // Set an output for the GitHub Action
      console.log('::set-output name=update_required::true')
    } else {
      console.log('No new updates found.')
    }
  } catch (error) {
    console.error('Error checking RSS feed:', error)
  }
})()
