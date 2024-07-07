'use client'
import { useState } from 'react'
import styles from './HeroTalents.module.css'

const ids1 = [
  ['Moondust', 'Stellar Command', 'The Light of Elune', 'Arcane Affinity'],
  ["Elune's Grace", 'Lunar Calling', 'Astral Insight', 'Lunation'],
]
const ids2 = [
  ['Power of Nature', "Grove's Inspiration", 'Bonteous Bloom', 'Power of the Dream'],
  ['Durability of Nature', 'Potent Enchantments', 'Early Spring', 'Control of the Dream'],
]

function HeroTalentsPicker({ selection }) {
  const selectedIds = selection ? ids2 : ids1
  const [switchStates, setSwitchStates] = useState(new Array(selectedIds[0].length).fill(false))

  const handleSwitch = (index) => {
    const newStates = [...switchStates]
    newStates[index] = !newStates[index]
    setSwitchStates(newStates)
  }

  return (
    <div
      className={`flex w-full flex-col items-center space-y-2 rounded-xl border-4 p-4 transition-colors duration-500 ${
        selection ? styles['bg-fade-resto'] : styles['bg-fade-balance']
      } ${selection ? styles['border-balance'] : styles['border-resto']}`}
    >
      {selectedIds[0].map((id, index) => (
        <div key={id} className="flex w-full items-center justify-center space-x-2">
          <span
            className={`flex-1 text-right font-bold ${switchStates[index] ? 'text-gray-500' : 'text-white underline'}`}
          >
            {id}
          </span>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
              switchStates[index] ? 'bg-gray-300' : 'bg-gray-300'
            }`}
            onClick={() => handleSwitch(index)}
          >
            <span
              className={`transform transition-transform duration-300 ease-in-out ${
                switchStates[index] ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 rounded-full bg-white`}
            />
          </button>
          <span
            className={`flex-1 text-left font-bold ${switchStates[index] ? 'text-white underline' : 'text-gray-500'}`}
          >
            {selectedIds[1][index]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default HeroTalentsPicker
