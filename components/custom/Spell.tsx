import fetch from 'node-fetch'
import spellData from '../../spellData.json'

import type { InferGetStaticPropsType, GetStaticProps } from 'next'

function formatUrl(url) {
  const parts = url.split('/')
  const lastPart = parts.pop()
  const formatted = lastPart
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted
}

function extractIdFromUrl(url) {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  const id = lastPart.split('-')[0]
  return id
}

export default async function Spell({ id, name }) {
  let display = name
  let displayId = id

  if (!id) {
    const url = spellData[name]
    if (url) {
      displayId = extractIdFromUrl(url)
    } else {
      console.error(`${name} not found in local spelldata`)
    }
  }

  if (!name) {
    const res = await fetch(`https://www.wowhead.com/spell=${id}`)
    display = formatUrl(res.url)
  }

  return (
    <>
      <a href={`https://www.wowhead.com/spell=${displayId}`} className="inline">
        {display}
      </a>{' '}
    </>
  )
}
