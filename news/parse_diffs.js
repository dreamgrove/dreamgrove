const fs = require('fs')
const path = require('path')

const currentFilePath = path.join(__dirname, 'druid_latest.txt')
const previousFilePath = path.join(__dirname, 'druid_previous.txt')
const outputFilePath = path.join(__dirname, 'differences.json')

const parseSpellData = (fileContent) => {
  const spells = []
  const lines = fileContent.split('\n')
  let currentSpell = null

  let effects = false
  lines.forEach((line) => {
    if (line.startsWith('Name             :')) {
      if (currentSpell) {
        spells.push(currentSpell)
        //console.log(currentSpell)
      }
      currentSpell = { name: '', attributes: {}, id: -1 }
      const nameMatch = line.match(/Name\s+: (.+?) \(id=(\d+)\)/)
      if (nameMatch) {
        currentSpell.name = nameMatch[1]
        currentSpell.id = nameMatch[2]
      }
    } else if (currentSpell) {
      const match = line.match(/^\s*([\w\s]+):\s*(.+)?/)

      if (line.startsWith('Effects')) {
        currentSpell.attributes.effects = []
      } else if (line.trim().startsWith('#')) {
        const effectMatch = line.match(/^\s*(#\d+ \(.+?\))\s*:\s*(.+)?/)
        if (effectMatch) {
          if (effectMatch[1].startsWith('#17')) {
            console.log(currentSpell)
            console.log(effectMatch[1])
          }
          currentSpell.attributes.effects.push({ id: effectMatch[1], data: effectMatch[2] || '' })
        }
      } else if (
        line.startsWith(' ') &&
        !line.trim().startsWith(':') &&
        currentSpell.attributes.effects.length > 0
      ) {
        let latestElement =
          currentSpell.attributes.effects[currentSpell.attributes.effects.length - 1]
        latestElement.data += `| ${line.trim()}`
      } else if (match) {
        const attribute = match[1].trim()
        const value = match[2] ? match[2].trim() : ''
        if (attribute.trim() !== '') {
          if (!currentSpell.attributes[attribute]) {
            //console.log(attribute + ':' + value)
            currentSpell.attributes[attribute] = value
          } else {
            currentSpell.attributes[attribute] += ` ${value}`
          }
        }
      }
    }
  })
  if (currentSpell) {
    spells.push(currentSpell)
  }

  return spells
}

const compareSpells = (prevSpells, currSpells) => {
  const differences = []

  currSpells.forEach((currSpell) => {
    const prevSpell = prevSpells.find((s) => s.name === currSpell.name && s.id == currSpell.id)
    if (!prevSpell) return

    const diff = []
    const attributesToCheck = ['GCD', 'Duration', 'Cooldown', 'Proc Chance', 'Effects']

    attributesToCheck.forEach((attr) => {
      const prevVal = prevSpell.attributes[attr] || null
      const currVal = currSpell.attributes[attr] || null

      if (attr === 'Effects') {
        if (currSpell.attributes.effects) {
          currSpell.attributes.effects.forEach((effect) => {
            const prevSpellEffect = prevSpell.attributes.effects.find((e) => e.id === effect.id)
            const currEffectValues = effect.data.split('|').map((val) => val.trim())
            const effectDiffs = []

            if (!prevSpellEffect) {
              currEffectValues.forEach((val) => {
                effectDiffs.push({ prevDiff: '', currDiff: val })
              })
            } else {
              const prevEffectValues = prevSpellEffect.data.split('|').map((val) => val.trim())

              // Check for changes in current effect
              currEffectValues.forEach((currVal, index) => {
                const prevVal = prevEffectValues[index] || ''
                if (prevVal !== currVal) {
                  effectDiffs.push({ prevDiff: prevVal, currDiff: currVal })
                }
              })

              // Check for removed values in the previous effect
              prevEffectValues.forEach((prevVal, index) => {
                if (
                  !currEffectValues.includes(prevVal) &&
                  !effectDiffs.some((diff) => diff.prevDiff === prevVal)
                ) {
                  effectDiffs.push({ prevDiff: prevVal, currDiff: '' })
                }
              })
            }

            if (effectDiffs.length > 0) {
              diff.push({
                attributeName: `Effect ${effect.id}`,
                effectDiffs: effectDiffs,
              })
            }
          })
        }
      }

      // Check if both values exist and are different
      else if (prevVal !== currVal) {
        diff.push({
          attributeName: attr,
          prevVal: prevVal || 'N/A',
          newVal: currVal || 'N/A',
        })
      }
    })

    if (diff.length > 0) {
      differences.push({ spell: currSpell.name, diff })
    }
  })

  return differences
}

const main = () => {
  try {
    const currentFileContent = fs.readFileSync(currentFilePath, 'utf-8')
    const previousFileContent = fs.readFileSync(previousFilePath, 'utf-8')

    const currentSpells = parseSpellData(currentFileContent)
    const previousSpells = parseSpellData(previousFileContent)

    const differences = compareSpells(previousSpells, currentSpells)

    fs.writeFileSync(outputFilePath, JSON.stringify({ differences }, null, 2))
    console.log('Differences saved to differences.json')
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

main()
