'use client'
import { useState } from 'react'
import HeroTalentsPicker from './HeroTalentsPicker'

export default function HeroTalents() {
  const [isOn, setIsOn] = useState(false)

  return (
    <div className="talents flex w-full flex-col items-center">
      <div className="mb-4 flex w-full items-center justify-center space-x-4">
        <span
          className={`flex-1 text-right text-lg font-bold ${isOn ? 'text-gray-500' : 'text-[#4b62be]'}`}
        >
          Elune's Chosen
        </span>
        <button
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
            isOn ? 'bg-[#184118]' : 'bg-[#4b62be]'
          }`}
          onClick={() => setIsOn(!isOn)}
        >
          <span
            className={`transform transition-transform duration-300 ease-in-out ${
              isOn ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 rounded-full bg-white`}
          />
        </button>
        <span
          className={`flex-1 text-left text-lg font-bold ${isOn ? 'text-[#9ee02d]' : 'text-gray-500'}`}
        >
          Keeper of The Grove
        </span>
      </div>
      <HeroTalentsPicker selection={isOn} />
    </div>
  )
}
