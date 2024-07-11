const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const baseUrl = 'https://www.wowdb.com'
const urls = ['https://www.wowdb.com/spells/class-abilities/druid']

const localOverwrites = {
  Cyclone: '33786',
  'new ability': '9393',
}

async function fetchPageData(url, data) {
  const res = await fetch(url)
  const html = await res.text()

  const $ = cheerio.load(html)

  $('a.t').each((_, element) => {
    const name = $(element).text().trim()
    const href = $(element).attr('href')
    const id = extractIdFromUrl(href)
    data[name] = id
  })

  const nextLink = $('a[rel="next"]').attr('href')
  if (nextLink) {
    await fetchPageData(baseUrl + nextLink, data)
  }
}

function extractIdFromUrl(url) {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

async function fetchData() {
  const data = {}

  for (const url of urls) {
    await fetchPageData(url, data)
  }

  for (const [name, id] of Object.entries(localOverwrites)) {
    data[name] = id
  }

  fs.writeFileSync('spellData.json', JSON.stringify(data, null, 2))
}

fetchData().catch(console.error)
