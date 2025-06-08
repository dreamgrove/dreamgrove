import React from 'react'
import { useSettings } from '../SettingsProvider'

interface CheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  title: string
  description: string
}

function Checkbox({ id, checked, onChange, title, description }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <label className="relative flex cursor-pointer items-start" htmlFor={id}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-neutral-600 bg-neutral-800 shadow transition-all checked:border-neutral-700 checked:bg-neutral-700 hover:shadow-md"
          id={id}
        />
      </label>
      <label className="ml-0 cursor-pointer text-sm text-neutral-300" htmlFor={id}>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-neutral-500">{description}</p>
        </div>
      </label>
    </div>
  )
}

export default function Settings() {
  const { showEventMarkers, setShowEventMarkers, timestampFormat, setTimestampFormat } =
    useSettings()

  return (
    <div className="mt-4">
      <h3 className="mb-4 text-lg font-medium">Timeline Settings</h3>
      <div className="space-y-4">
        <Checkbox
          id="show-event-markers"
          checked={showEventMarkers}
          onChange={setShowEventMarkers}
          title="Show Event Markers"
          description="Displays event markers on the timeline for debugging purposes. NB: the events that will be displayed do not always correspond to the final timeline"
        />

        <Checkbox
          id="timestamp-format"
          checked={timestampFormat === 'minutes'}
          onChange={(checked) => setTimestampFormat(checked ? 'minutes' : 'seconds')}
          title="Show Timestamps as Minutes:Seconds"
          description='Display timeline markers in MM:SS format instead of seconds (e.g., "1:30" instead of "90s")'
        />
      </div>
    </div>
  )
}
