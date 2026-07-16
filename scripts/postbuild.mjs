import rss from './rss.mjs'
import populateSpellDb from './populate-spell-db.mjs'

async function postbuild() {
  await rss()
  await populateSpellDb() // non-fatal wrapper — never throws
}

postbuild()
