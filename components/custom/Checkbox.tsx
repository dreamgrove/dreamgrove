import React, { useMemo } from 'react'
import CheckboxToggler from './CheckboxToggler'
import Wowhead from './Wowhead'
import { FaCheck } from 'react-icons/fa'

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

  const child = <Wowhead type={type} id={spellId} name={name} disabled={disabled} />

  if (spellId === '' && id === '') {
    throw Error('A Checkbox without children needs at least an id or a spellId')
  }

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
