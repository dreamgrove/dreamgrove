import CheckboxToggler from './CheckboxToggler'
import Wowhead from './Wowhead'
import { FaCheck } from 'react-icons/fa'
import clsx from 'clsx'

const Checkbox = ({
  id = '',
  spellId = '',
  name = '',
  type = 'spell',
  radio = '',
  defaultCheck = false,
  isText = false,
  disabled = true,
  isIcon = false,
  children,
}) => {
  const logger = console
  logger.info(`[Checkbox] Rendering checkbox with id: ${id || spellId}`, {
    origin: 'components/custom/Checkbox.tsx',
  })

  const checkboxId = id === '' ? spellId : id

  const child = isText ? (
    name
  ) : children ? (
    children
  ) : (
    <Wowhead type={type} id={spellId} name={name} disabled={disabled} />
  )

  if (spellId === '' && id === '') {
    throw Error('A Checkbox without children needs at least an id or a spellId')
  }

  if (isIcon) {
    return (
      <div style={{ userSelect: 'none', height: '100%' }} className="relative flex h-full w-full">
        <CheckboxToggler
          id={checkboxId}
          defaultCheck={defaultCheck}
          radio={radio}
          isIcon={true}
          className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
          checkedContent={
            <div className="relative flex h-full w-full items-center rounded border-[1px] border-main px-2 py-1.5 sm:px-3">
              <div className="break-words text-left normal-case leading-tight">{child}</div>
              <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-main/20 md:bottom-auto md:right-2 md:top-1/2 md:-translate-y-1/2">
                <FaCheck className="text-main" size={12} />
              </div>
            </div>
          }
          uncheckedContent={
            <div className="flex h-full w-full items-center rounded border-[1px] border-main/20 px-2 py-1.5 sm:px-3">
              <div className="break-words text-left normal-case leading-tight">{child}</div>
            </div>
          }
        >
          <div />
        </CheckboxToggler>
      </div>
    )
  }

  return (
    <div style={{ userSelect: 'none' }} className="mb-2 mt-2 min-h-[16px] whitespace-normal">
      <CheckboxToggler id={checkboxId} defaultCheck={defaultCheck} radio={radio} isIcon={false}>
        {child}
      </CheckboxToggler>
    </div>
  )
}

export default Checkbox
