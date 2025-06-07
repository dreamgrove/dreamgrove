import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { SpellInfo, SpellTimeline, PlayerAction } from '../../lib/types/cd_planner'
import { addCustomSpell } from '../../lib/utils/customSpellStorage'

interface CustomElementProps {
  onCreate?: (params: SpellInfo) => void
  onDelete?: (spellId: number) => void
}

export default function CustomElement({ onCreate, onDelete }: CustomElementProps) {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [name, setName] = useState('')
  const [cooldown, setCooldown] = useState<string | number>(60)
  const [effectDuration, setEffectDuration] = useState<string | number>(10)
  const [charges, setCharges] = useState<string | number>(1)
  const [isChanneled, setIsChanneled] = useState(false)
  const [channelDuration, setChannelDuration] = useState<string | number>(2)
  const [spellId, setSpellId] = useState<string | number>('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible)
    setErrorMessage('')
  }

  const handleSpecToggle = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setErrorMessage('Please enter a spell name')
      return
    }

    // Convert empty strings to 0
    const finalCooldown = cooldown === '' ? 0 : Number(cooldown)
    const finalEffectDuration = effectDuration === '' ? 0 : Number(effectDuration)
    const finalCharges = charges === '' ? 0 : Math.max(1, Number(charges))
    const finalChannelDuration = channelDuration === '' ? 0 : Number(channelDuration)
    const finalSpellId = spellId === '' ? undefined : Number(spellId)

    // Validation checks
    if (finalCooldown > 600) {
      setErrorMessage('Cooldown cannot exceed 600 seconds')
      return
    }

    if (finalEffectDuration > 600) {
      setErrorMessage('Effect duration cannot exceed 600 seconds')
      return
    }

    if (finalChannelDuration > 600) {
      setErrorMessage('Channel duration cannot exceed 600 seconds')
      return
    }

    if (finalCharges > 10) {
      setErrorMessage('Charges cannot exceed 10')
      return
    }

    // Either use the selected specs or set to 'all'
    const specsList = selectedSpecs.length > 0 ? selectedSpecs : ['all']

    // Create the custom spell using the utility function
    const customSpell = addCustomSpell({
      name: name.trim(),
      cooldown: finalCooldown,
      effect_duration: finalEffectDuration,
      charges: finalCharges,
      channel_duration: isChanneled ? finalChannelDuration : 0,
      channeled: isChanneled,
      specs: specsList,
      mrtSpellId: finalSpellId,
    })

    if (onCreate) {
      onCreate(customSpell)
    }

    setName('')
    setCooldown(60)
    setEffectDuration(10)
    setCharges(1)
    setIsChanneled(false)
    setChannelDuration(2)
    setSpellId('')
    setSelectedSpecs([])
    setIsFormVisible(false)
    setErrorMessage('')
  }

  return (
    <div>
      <button
        onClick={toggleFormVisibility}
        id="tour-custom-button-selector"
        className="relative w-fit bg-neutral-900/50 px-4 py-2 text-white hover:bg-neutral-800 focus:outline-hidden"
        title={isFormVisible ? 'Hide custom spell form' : 'Add custom spell'}
      >
        {isFormVisible ? 'Hide' : 'Add Custom Element'}
      </button>
      <div className="relative">
        {isFormVisible && (
          <div className="absolute top-2 left-0 z-50 w-96 bg-neutral-900 p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Add Custom Spell</h3>
              <button onClick={toggleFormVisibility} className="text-gray-400 hover:text-white">
                ×
              </button>
            </div>

            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-xs text-white">
                    Spell Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
                    placeholder=""
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
                    onChange={(e) => setCooldown(e.target.value)}
                    min={0}
                    max={600}
                    step={1}
                    className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
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
                    onChange={(e) => setEffectDuration(e.target.value)}
                    min={0}
                    max={600}
                    step={0.5}
                    className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
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
                    onChange={(e) => setCharges(e.target.value)}
                    min={1}
                    max={10}
                    className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
                  />
                </div>

                <div>
                  <label htmlFor="spellId" className="block text-xs text-gray-300">
                    Spell ID (optional)
                  </label>
                  <input
                    type="number"
                    id="spellId"
                    value={spellId}
                    onChange={(e) => setSpellId(e.target.value)}
                    min={1}
                    className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
                    placeholder="e.g. 319454"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="mb-1 flex items-center">
                    <input
                      type="checkbox"
                      id="isChanneled"
                      checked={isChanneled}
                      onChange={(e) => setIsChanneled(e.target.checked)}
                      className="mr-2 h-3.5 w-3.5 border-0 bg-gray-700 ring-transparent focus:ring-transparent focus:ring-offset-0"
                    />
                    <label htmlFor="isChanneled" className="text-xs text-gray-300 select-none">
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
                        onChange={(e) => setChannelDuration(e.target.value)}
                        min={0}
                        max={600}
                        step={0.5}
                        className="mt-1 w-full border-neutral-700 bg-neutral-200/40 px-2 py-1 text-sm text-white placeholder:text-neutral-200"
                      />
                    </div>
                  )}
                </div>

                <div className="col-span-2 mt-2">
                  <label className="mb-1 block text-xs text-gray-300">
                    Specs (none = all specs)
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['balance', 'resto', 'feral', 'guardian'].map((spec) => (
                      <div key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`spec-${spec}`}
                          checked={selectedSpecs.includes(spec)}
                          onChange={() => handleSpecToggle(spec)}
                          className="mr-1 h-3.5 w-3.5 border-gray-700 bg-gray-700 text-purple-600"
                        />
                        <label
                          htmlFor={`spec-${spec}`}
                          className="text-xs text-gray-300 capitalize"
                        >
                          {spec}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex justify-between">
                <button
                  type="submit"
                  className="bg-emerald-600 px-3 py-1 text-sm text-white hover:bg-emerald-700 focus:ring-1 focus:outline-hidden"
                >
                  Add Spell
                </button>

                <button
                  type="button"
                  onClick={toggleFormVisibility}
                  className="bg-gray-700 px-3 py-1 text-sm text-white hover:bg-gray-600 focus:ring-1 focus:ring-gray-500 focus:outline-hidden"
                >
                  Cancel
                </button>
              </div>

              {errorMessage && (
                <div className="mt-2 bg-red-900/50 p-2 text-xs text-red-200">{errorMessage}</div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
