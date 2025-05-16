import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SpellInfo } from './types'

interface CustomElementProps {
  currentSpells: any[]
  setCurrentSpells: React.Dispatch<React.SetStateAction<any[]>>
  total_length_s: number
  spells: SpellInfo[]
  setSpells: React.Dispatch<React.SetStateAction<SpellInfo[]>>
}

export default function CustomElement({ total_length_s, spells, setSpells }: CustomElementProps) {
  // State for the custom element form
  const [name, setName] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const [effectDuration, setEffectDuration] = useState(0)
  const [channelDuration, setChannelDuration] = useState(0)
  const [charges, setCharges] = useState(1)
  const [isChanneled, setIsChanneled] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)

  // Toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible)
  }

  // Validate the form
  const validateForm = () => {
    if (!name.trim()) {
      setErrorMessage('Spell name is required')
      return false
    }
    if (cooldown <= 0) {
      setErrorMessage('Cooldown must be greater than 0')
      return false
    }
    if (effectDuration < 0) {
      setErrorMessage('Effect duration cannot be negative')
      return false
    }
    if (isChanneled && channelDuration <= 0) {
      setErrorMessage('Channel duration must be greater than 0 for channeled spells')
      return false
    }
    if (charges < 1) {
      setErrorMessage('Charges must be at least 1')
      return false
    }
    return true
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Create a unique ID for the custom spell
    const customId = `custom-${uuidv4()}`

    // Create a custom spell that matches the SpellInfo interface
    const customSpell: SpellInfo = {
      id: customId,
      spellId: Math.floor(Math.random() * 1000000), // Random spellId for uniqueness
      name: name,
      channel_duration: isChanneled ? channelDuration : 0,
      effect_duration: effectDuration,
      cooldown: cooldown,
      charges: charges > 1 ? charges : undefined, // Only set charges if > 1
      channeled: isChanneled,
    }

    // Add the custom spell to the spells array
    setSpells((prevSpells) => [...prevSpells, customSpell])

    // Reset form
    setName('')
    setCooldown(0)
    setEffectDuration(0)
    setChannelDuration(0)
    setCharges(1)
    setIsChanneled(false)
    setErrorMessage(null)

    // Hide form after successful submission
    setIsFormVisible(false)
  }

  return (
    <div>
      <button
        onClick={toggleFormVisibility}
        className="rounded bg-gray-700 px-2 py-0.5 text-white hover:bg-gray-600"
        title={isFormVisible ? 'Hide custom spell form' : 'Add custom spell'}
      >
        {isFormVisible ? 'Hide Custom' : 'Add Custom'}
      </button>

      {isFormVisible && (
        <div className="absolute right-0 top-12 z-50 w-96 rounded-md bg-gray-800 p-4 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Add Custom Spell</h3>
            <button onClick={toggleFormVisibility} className="text-gray-400 hover:text-white">
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-xs text-gray-300">
                  Spell Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md border-gray-700 bg-gray-700 px-2 py-1 text-sm text-white"
                  placeholder="Spell name"
                />
              </div>

              <div>
                <label htmlFor="cooldown" className="block text-xs text-gray-300">
                  Cooldown (s)
                </label>
                <input
                  type="number"
                  id="cooldown"
                  value={cooldown}
                  onChange={(e) => setCooldown(Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="mt-1 w-full rounded-md border-gray-700 bg-gray-700 px-2 py-1 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="effectDuration" className="block text-xs text-gray-300">
                  Effect Duration (s)
                </label>
                <input
                  type="number"
                  id="effectDuration"
                  value={effectDuration}
                  onChange={(e) => setEffectDuration(Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="mt-1 w-full rounded-md border-gray-700 bg-gray-700 px-2 py-1 text-sm text-white"
                />
              </div>

              <div>
                <label htmlFor="charges" className="block text-xs text-gray-300">
                  Charges
                </label>
                <input
                  type="number"
                  id="charges"
                  value={charges}
                  onChange={(e) => setCharges(Math.max(1, Number(e.target.value)))}
                  min={1}
                  className="mt-1 w-full rounded-md border-gray-700 bg-gray-700 px-2 py-1 text-sm text-white"
                />
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex items-center">
                  <input
                    type="checkbox"
                    id="isChanneled"
                    checked={isChanneled}
                    onChange={(e) => setIsChanneled(e.target.checked)}
                    className="mr-2 h-3.5 w-3.5 rounded border-gray-700 bg-gray-700 text-purple-600"
                  />
                  <label htmlFor="isChanneled" className="text-xs text-gray-300">
                    Channeled Spell
                  </label>
                </div>

                {isChanneled && (
                  <div>
                    <label htmlFor="channelDuration" className="block text-xs text-gray-300">
                      Channel Duration (s)
                    </label>
                    <input
                      type="number"
                      id="channelDuration"
                      value={channelDuration}
                      onChange={(e) => setChannelDuration(Number(e.target.value))}
                      min={0}
                      step={0.5}
                      className="mt-1 w-full rounded-md border-gray-700 bg-gray-700 px-2 py-1 text-sm text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex justify-between">
              <button
                type="submit"
                className="rounded-md bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                Add Spell
              </button>

              <button
                type="button"
                onClick={toggleFormVisibility}
                className="rounded-md bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>

            {errorMessage && (
              <div className="mt-2 rounded-md bg-red-900/50 p-2 text-xs text-red-200">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  )
}
