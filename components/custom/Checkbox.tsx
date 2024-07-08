import CheckboxToggler from './CheckboxToggler'
import Wowhead from './Wowhead'

const Checkbox = ({
  id = '',
  spellId = '',
  name = '',
  type = 'spell',
  radio = '',
  defaultCheck = false,
  isText = false,
  disabled = true,
  children,
}) => {
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

  return (
    <div style={{ userSelect: 'none' }} className="x mb-2 mt-2 min-h-[16px] whitespace-nowrap">
      <CheckboxToggler id={id === '' ? spellId : id} defaultCheck={defaultCheck} radio={radio}>
        {child}
      </CheckboxToggler>
    </div>
  )
}

export default Checkbox
