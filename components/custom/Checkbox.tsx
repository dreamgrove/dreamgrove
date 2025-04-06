import React, { useMemo } from 'react'
import CheckboxToggler from './CheckboxToggler'
import Wowhead from './Wowhead'
import { FaCheck } from 'react-icons/fa'
import CheckboxClientVersion from '../csm/CheckboxClientVersion'
import ProfiledCheckboxToggler from 'cursor/ProfiledCheckboxToggler'

// Define proper prop types
interface CheckboxProps {
  id?: string
  spellId?: string | number
  name?: string
  type?: string
  radio?: string
  defaultCheck?: boolean
  isText?: boolean
  disabled?: boolean
  isIcon?: boolean
  children?: React.ReactNode
}

const PlaceHolder = ({ name }: { name: string }) => {
  return <div className="text-gray-500">{name}</div>
}

const Checkbox = ({
  id = '',
  spellId = '',
  name = '',
  type = 'spell',
  radio = '',
  defaultCheck = false,
  disabled = true,
}: CheckboxProps) => {
  const checkboxId = id === '' ? spellId.toString() : id

  const child =
    (spellId === '' && id === '') || (spellId !== '' && id === '') ? (
      <PlaceHolder name={'[FIX ME]'} />
    ) : (
      <Wowhead type={type} id={spellId} name={name} disabled={disabled} />
    )

  return (
    <div style={{ userSelect: 'none', height: '100%' }} className="relative flex h-full w-full">
      <CheckboxToggler
        id={checkboxId}
        defaultCheck={defaultCheck}
        radio={radio}
        isIcon={true}
        className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
      >
        {child}
      </CheckboxToggler>
    </div>
  )
}

export default React.memo(Checkbox)
