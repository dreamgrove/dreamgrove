import fs from 'fs'

// Read the file
function parseFile(filename, callback) {
  fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    // Split the file into lines and ignore the first line
    const lines = data.split('\n').slice(1)

    // Split the lines into blocks based on empty lines
    const entities = []
    let currentEntity = {}
    let currentEffect = {}
    let skipLines = false
    let inEffectsSection = false

    lines.forEach((line, index) => {
      if (line.trim() === '' && lines[index + 1] && lines[index + 1].startsWith('Name')) {
        // End of a block
        if (Object.keys(currentEntity).length > 0) {
          skipLines = false
          inEffectsSection = false

          entities.push(currentEntity)
          currentEntity = {}
        }
      } else {
        if (skipLines) {
          const keyValuePattern = /^\s*[^:]+?\s+:\s*.+/

          if (keyValuePattern.test(line.trim()) || line.startsWith('Effects')) {
            //console.log('stopped skipping at: ' + line)
            skipLines = false // Stop skipping if line matches key-value pattern
          } else {
            //console.log('skipping line ' + line)
          }
        }
        if (inEffectsSection) {
          if (line.startsWith('#')) {
            if (Object.keys(currentEffect).length > 0) {
              currentEntity.effects.push(currentEffect)
              currentEffect = {}
            }
            const idMatch = line.match(/#(\d+)\s+\(id=(\d+)\)/)

            if (idMatch) {
              currentEffect.idx = idMatch[1]
              currentEffect.id = idMatch[2]
              const parts = line.split(':', 2) // Split on the first colon
              if (parts.length > 1) {
                let effectDetails = parts[1].trim()
                effectDetails = effectDetails.replace(/\(\d+\)/g, '').trim() // Remove all (number)
                effectDetails = effectDetails.replace(/\s+/g, ' ') // Replace multiple spaces with a single space

                const effectParts = effectDetails.split('|').map((part) => part.trim())

                currentEffect.type = effectParts[0]
                if (effectParts.length > 1) {
                  currentEffect.subtype = effectParts[1]
                }
              }
            }
          } else if (line.startsWith(' ')) {
            let effectValues = line.trim()
            effectValues = effectValues.replace(/\(\d+\)/g, '').trim() // Remove all (number)
            effectValues = effectValues.replace(/\s+/g, ' ') // Replace multiple spaces with a single space
            const values = effectValues.split('|')
            if (!currentEffect.values) {
              currentEffect.values = []
            }
            values.forEach((value) => {
              const [key, val] = value.split(':').map((part) => part.trim())

              if (key && val) {
                if (key.startsWith('Affected Spells')) {
                  if (!currentEffect.affected_spells) {
                    currentEffect.affected_spells = []
                  }
                  currentEffect.affected_spells.push(val.split(',').map((s) => s.trim()))
                } else {
                  currentEffect.values.push({ [key]: val })
                }
              }
            })
          } else {
            currentEntity.effects.push(currentEffect)
            currentEffect = {}
            inEffectsSection = false
          }
        }
        if (!skipLines && !inEffectsSection) {
          if (line.startsWith('Name')) {
            const match = line.match(/Name\s+:\s+([^(]+?)\s+\(.*?\bid=(\d+)\)/)

            if (match) {
              currentEntity.name = match[1].trim()
              currentEntity.id = parseInt(match[2])
            }
          } else if (line.startsWith('Talent Entry')) {
            const match = line.match(/Talent Entry\s+:\s+([^[]+)\s*\[/)
            if (match) {
              currentEntity.talent = match[1].trim()
            }
          } else if (line.startsWith('Class')) {
            const match = line.match(/Class\s+:\s+(.+)/)
            if (match) {
              currentEntity.class = match[1].trim()
            }
          } else if (line.startsWith('School')) {
            const match = line.match(/School\s+:\s+(.+)/)
            if (match) {
              currentEntity.school = match[1].trim()
            }
          } else if (line.startsWith('Spell Type')) {
            const match = line.match(/Spell Type\s+:\s+(.+)/)
            if (match) {
              currentEntity.spell_type = match[1].trim()
            }
          } else if (line.startsWith('Spell Level')) {
            const match = line.match(/Spell Level\s+:\s+(.+)/)
            if (match) {
              currentEntity.spell_level = match[1].trim()
            }
          } else if (line.startsWith('GCD')) {
            const match = line.match(/GCD\s+:\s+(.+)/)
            if (match) {
              currentEntity.gcd = match[1].trim()
            }
          } else if (line.startsWith('Duration')) {
            const match = line.match(/Duration\s+:\s+(.+)/)
            if (match) {
              currentEntity.duration = match[1].trim()
            }
          } else if (line.startsWith('Cooldown')) {
            const match = line.match(/Cooldown\s+:\s+(.+)/)
            if (match) {
              currentEntity.cooldown = match[1].trim()
            }
          } else if (line.startsWith('Proc Chance')) {
            const match = line.match(/Proc Chance\s+:\s+(.+)/)
            if (match) {
              currentEntity.proc_chance = match[1].trim()
            }
          } else if (line.startsWith('Mechanic')) {
            const match = line.match(/Mechanic\s+:\s+(.+)/)
            if (match) {
              currentEntity.mechanic = match[1].trim()
            }
          } else if (line.startsWith('Resource')) {
            const match = line.match(/Resource\s+:\s+(.+)/)
            if (match) {
              currentEntity.resource = match[1].trim()
            }
          } else if (line.startsWith('Range')) {
            const match = line.match(/Range\s+:\s+(.+)/)
            if (match) {
              currentEntity.range = match[1].trim()
            }
          } else if (line.startsWith('Charges')) {
            const match = line.match(/Charges\s+:\s+(.+)/)
            if (match) {
              currentEntity.charges = match[1].trim()
            }
          } else if (line.startsWith('Cast Time')) {
            const match = line.match(/Cast Time\s+:\s+(.+)/)
            if (match) {
              currentEntity.cast_time = match[1].trim()
            }
          } else if (line.startsWith('Internal Cooldown')) {
            const match = line.match(/Internal Cooldown\s+:\s+(.+)/)
            if (match) {
              currentEntity.internal_cooldown = match[1].trim()
            }
          } else if (line.startsWith('Stacks')) {
            const match = line.match(/Stacks\s+:\s+(.+)/)
            if (match) {
              currentEntity.stacks = match[1].trim()
            }
          } else if (line.startsWith('Race')) {
            const match = line.match(/Race\s+:\s+(.+)/)
            if (match) {
              currentEntity.race = match[1].trim()
            }
          } else if (line.startsWith('Max Targets')) {
            const match = line.match(/Max Targets\s+:\s+(.+)/)
            if (match) {
              currentEntity.max_targets = match[1].trim()
            }
          } else if (line.startsWith('Velocity')) {
            const match = line.match(/Velocity\s+:\s+(.+)/)
            if (match) {
              currentEntity.velocity = match[1].trim()
            }
          } else if (line.startsWith('Real PPM')) {
            const match = line.match(/Real PPM\s+:\s+(.+)/)
            if (match) {
              currentEntity.real_ppm = match[1].trim()
            }
          } else if (line.startsWith('Travel Time')) {
            const match = line.match(/Travel Time\s+:\s+(.+)/)
            if (match) {
              currentEntity.travel_time = match[1].trim()
            }
          } else if (line.startsWith('Effects')) {
            inEffectsSection = true
            currentEntity.effects = []
            currentEffect = {}
          } else if (
            line.startsWith('Labels') ||
            line.startsWith('Attributes') ||
            line.startsWith('Description') ||
            line.startsWith('Variables') ||
            line.startsWith('Tooltip')
          ) {
            //console.log('starting skip: ' + line)
            skipLines = true
          } else if (
            line.trim() == '' ||
            line.startsWith('Proc Flags') ||
            line.startsWith('Category') ||
            line.startsWith('Req. Max Level') ||
            line.startsWith('Requires armor') ||
            line.startsWith('Replaces') ||
            line.startsWith('Covenant') ||
            line.startsWith('Family Flags') ||
            line.startsWith('Azerite') ||
            line.startsWith('Conduit Id') ||
            line.startsWith('Stance Mask') ||
            line.startsWith('Triggered by') ||
            line.startsWith('Affecting spells') ||
            line.startsWith('Affecting spells') ||
            line.startsWith('Max Scaling Level')
          ) {
            // do nothing
          }
        }
      }
    })

    entities.push(currentEntity)
    callback(entities)
  })
}

function compareObjectArrays(prev, newArr) {
  const changes = []

  const findObjectById = (array, id) => array.find((obj) => obj.id === id)

  prev.forEach((prevObj) => {
    const newObj = findObjectById(newArr, prevObj.id)
    if (!newObj) {
      changes.push({ type: 'removed', name: prevObj.name, id: prevObj.id })
    } else {
      const modifiedFields = []
      for (const key in prevObj) {
        if (key !== 'effects' && prevObj[key] !== newObj[key]) {
          modifiedFields.push({
            field: key,
            prev: prevObj[key],
            new: newObj[key],
          })
        }
      }

      const prevEffects = prevObj.effects || []
      const newEffects = newObj.effects || []
      const effectChanges = []

      prevEffects.forEach((prevEffect) => {
        const newEffect = findObjectById(newEffects, prevEffect.id)
        if (!newEffect) {
          effectChanges.push({ type: 'removed', name: prevEffect.name, id: prevEffect.id })
        } else {
          const effectModifications = []
          for (const key in prevEffect) {
            if (key !== 'values' && JSON.stringify(prevObj[key]) !== JSON.stringify(newObj[key])) {
              effectModifications.push({
                field: key,
                prev: prevEffect[key],
                new: newEffect[key],
              })
            }
          }

          const prevValues = prevEffect.values || []
          const newValues = newEffect.values || []
          const valueChanges = []

          prevValues.forEach((prevValue) => {
            const prevKey = Object.keys(prevValue)[0]
            const prevVal = prevValue[prevKey]

            const newValue = newValues.find((val) => Object.keys(val)[0] === prevKey)

            if (!newValue) {
              valueChanges.push({ type: 'removed', key: prevKey })
            } else {
              const newVal = newValue[prevKey]
              if (prevVal !== newVal) {
                valueChanges.push({
                  key: prevKey,
                  prev: prevVal,
                  new: newVal,
                })
              }
            }
          })

          // Check for new values not present in prevValues
          newValues.forEach((newValue) => {
            const newKey = Object.keys(newValue)[0]
            if (!prevValues.find((val) => Object.keys(val)[0] === newKey)) {
              valueChanges.push({ type: 'added', key: newKey, new: newValue[newKey] })
            }
          })

          if (effectModifications.length > 0 || valueChanges.length > 0) {
            effectChanges.push({
              id: prevEffect.id,
              modifications: effectModifications,
              values: valueChanges,
            })
          }
        }
      })

      newEffects.forEach((newEffect) => {
        if (!findObjectById(prevEffects, newEffect.id)) {
          effectChanges.push({ type: 'added', effect: newEffect })
        }
      })

      if (modifiedFields.length > 0 || effectChanges.length > 0) {
        changes.push({
          name: prevObj.name,
          id: prevObj.id,
          type: 'modified',
          fields: modifiedFields,
          effects: effectChanges,
        })
      }
    }
  })

  newArr.forEach((newObj) => {
    if (!findObjectById(prev, newObj.id)) {
      changes.push({ type: 'added', id: newObj.id })
    }
  })

  return changes
}

parseFile('druid_latest.txt', (lat) => {
  parseFile('druid_previous.txt', (prev) => {
    const delta = compareObjectArrays(lat, prev)
    console.log(JSON.stringify({ delta }, null, 2))
  })
})
