import Collapsible from '../Collapsible/Collapsible'
import Wowhead from '../Wowhead'
import { FaLongArrowAltRight } from 'react-icons/fa'
import { FaRegArrowAltCircleUp } from 'react-icons/fa'
import { FaRegArrowAltCircleDown } from 'react-icons/fa'

interface FieldDisplayProps {
  field: { [key: string]: string | number }
}

/*

This whole Entry visualization has been written at 3AM and with zero desire to touch the `parse.js` script once again

Given the dubious structure of the produced diff.json, the resulting view for it is also dubious 

Not proud of this whole mess but it is what it is

*/

export default function EntityEntry({ entity }) {
  return (
    <div className="mb-4 flex flex-col p-4 ">
      <div className="text-xl font-bold">
        <Wowhead type="spell" name={entity.name} id={entity.id} />
        {entity.talent_entry && (
          <span className="text-lg text-gray-600">{`(${entity.talent_entry})`}</span>
        )}
      </div>
      <div className="mb-4 text-sm text-gray-600">{`Spell ID: ${entity.id}`}</div>
      {entity.fields.length > 0 && (
        <Collapsible title="Fields">
          {entity.fields.map((field, idx) => (
            <FieldDiff key={idx} field={field} />
          ))}
        </Collapsible>
      )}
      {entity.effects.map((effect, idx) => (
        <EffectDiff key={idx} effect={effect} />
      ))}
    </div>
  )
}

const FieldDiff = ({ field }) => {
  const calculatePercentageDiff = (prev, current) => {
    if (prev === 0) return current > 0 ? 100 : -100 // handle division by zero case
    return ((current - prev) / Math.abs(prev)) * 100
  }

  const getStatus = (prev, current) => {
    const diff = calculatePercentageDiff(prev, current)
    if (prev < current)
      return (
        <span>
          Buffed by {diff.toFixed(2)}%{' '}
          <FaRegArrowAltCircleUp className="inline-block align-text-top text-green-400" />
        </span>
      )
    if (prev > current)
      return (
        <span>
          Nerfed by {diff.toFixed(2)}%{' '}
          <FaRegArrowAltCircleDown className="inline-block align-text-top text-red-500" />
        </span>
      )
    return null
  }
  return (
    <div>
      <span>{field.field || field.key}: </span>
      <span className="text-red-500 ">{field.prev}</span>
      <span>
        <FaLongArrowAltRight className="ml-1 inline-block" />
      </span>
      <span className="ml-1 text-green-500">{field.new}</span>
      {false &&
        field.prev !== undefined &&
        field.new !== undefined &&
        (() => {
          const prevValue = parseFloat(field.prev)
          const newValue = parseFloat(field.new)

          if (!isNaN(prevValue) && !isNaN(newValue) && prevValue !== newValue) {
            return (
              <span className="ml-2">
                {' - '}
                {getStatus(prevValue, newValue)}
              </span>
            )
          }

          return null
        })()}
    </div>
  )
}

const FieldDisplay: React.FC<FieldDisplayProps> = ({ field }) => {
  const [key, value] = Object.entries(field)[0]

  return (
    <div>
      <span className="text-l font-bold">{key}</span>

      <span>
        <FaLongArrowAltRight className="mx-1 inline-block" />
      </span>
      <span>{value}</span>
    </div>
  )
}

const EffectDisplay = ({ effect }) => {
  return (
    <Collapsible
      title={`# ${effect.idx}: ${effect.type} ${effect.subtype ? '- ' + effect.subtype : ''}`}
      type="added"
    >
      <div className="mt-1 pl-4 text-green-900">
        <span className="text-xl font-bold ">Added</span>
      </div>
      <div className="mb-4 px-4 py-2">
        <div className="text-sm text-gray-600">
          <span className="font-bold">ID:</span> {effect.id}
        </div>
        {effect.affected_spells && (
          <div>
            <span className="font-bold">Affected Spells:</span>
            <div className="ml-4">
              {effect.affected_spells.map((spell, idx) => {
                const match = spell.match(/(.*) \((\d+)\)/)
                if (match) {
                  const [_, name, id] = match
                  return <Wowhead key={idx} type="spell" name={name} id={id} />
                }
                return null
              })}
            </div>
          </div>
        )}
        {effect.values && (
          <div>
            <span className="font-bold">Values:</span>
            <div className="ml-4">
              {effect.values.map((value, idx) => (
                <FieldDisplay key={idx} field={value} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Collapsible>
  )
}

const EffectDiff = ({ effect }) => {
  //console.log(effect)
  if (effect.status == 'added') {
    return <EffectDisplay effect={effect} />
  }
  if (effect.type == 'added') {
    return <EffectDisplay effect={effect.effect} />
  }
  return (
    <Collapsible
      title={`Effect # ${effect.idx}: ${effect.type} ${effect.subtype ? '- ' + effect.subtype : ''}`}
    >
      <div className="mb-4  px-4 py-2">
        <div className="text-sm text-gray-600">
          <span className="font-bold">ID:</span> {effect.id}
        </div>
        {effect.affected_spells && (
          <div>
            <span className="font-bold">Affected Spells:</span>
            <div className="ml-4">
              {effect.affected_spells.map((spell, idx) => {
                const match = spell.match(/(.*) \((\d+)\)/)
                if (match) {
                  const [_, name, id] = match
                  return <Wowhead key={idx} type="spell" name={name} id={id} />
                }
                return null
              })}
            </div>
          </div>
        )}
        {effect.values && (
          <div>
            <span className="font-bold">Changed Values:</span>
            <div className="ml-4">
              {effect.values.map((value, idx) => (
                <FieldDiff key={idx} field={value} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Collapsible>
  )
}
