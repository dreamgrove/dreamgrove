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
      <div
        style={{ userSelect: 'none' }}
        className="relative mb-2 mt-2 min-h-[16px] w-full whitespace-nowrap"
      >
        <CheckboxToggler
          id={checkboxId}
          defaultCheck={defaultCheck}
          radio={radio}
          isIcon={true}
          className="absolute left-0 top-0 z-10 h-full w-full cursor-pointer opacity-0"
          checkedContent={
            <div className="flex w-full items-center gap-2 rounded border-2 border-main px-3 py-1.5">
              <div className="w-4 flex-shrink-0">
                <FaCheck className="text-main" />
              </div>
              {child}
            </div>
          }
          uncheckedContent={
            <div className="flex w-full items-center gap-2 rounded border-2 border-main/20 px-3 py-1.5">
              <div className="w-4 flex-shrink-0"></div>
              {child}
            </div>
          }
        >
          <div />
        </CheckboxToggler>
      </div>
    )
  }

  return (
    <div style={{ userSelect: 'none' }} className="mb-2 mt-2 min-h-[16px] whitespace-nowrap">
      <CheckboxToggler id={checkboxId} defaultCheck={defaultCheck} radio={radio} isIcon={false}>
        {child}
      </CheckboxToggler>
    </div>
  )
}

export default Checkbox
