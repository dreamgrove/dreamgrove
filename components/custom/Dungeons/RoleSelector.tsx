'use client'
import balanceIcon from '../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../public/static/images/icons/guardian.jpg'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useRef, Suspense, useContext } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import { CheckboxContext } from '../CheckboxProvider'

type SpecName = 'Guardian' | 'Feral' | 'Resto' | 'Balance'

const SPEC_META: Record<SpecName, { icon: StaticImageData; accent: string; role: string }> = {
  Guardian: { icon: guardianIcon, accent: '#d97a3b', role: 'Tank' },
  Feral: { icon: feralIcon, accent: '#e6b16a', role: 'DPS' },
  Resto: { icon: restoIcon, accent: '#1a9c82', role: 'Healer' },
  Balance: { icon: balanceIcon, accent: '#8a6fd6', role: 'DPS' },
}

const SegmentButton = ({ text }: { text: SpecName }) => {
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)
  const isChecked = checkboxMap[text]?.checked || false
  const meta = SPEC_META[text]

  return (
    <button
      type="button"
      onClick={() => updateCheckbox(text, !isChecked, null)}
      className={`spec-seg ${isChecked ? 'spec-seg--active' : ''}`}
      style={{ ['--spec-accent' as string]: meta.accent }}
      aria-pressed={isChecked}
    >
      <span className="spec-seg__icon">
        <Image src={meta.icon} alt="" width={40} height={40} />
      </span>
      <span className="spec-seg__name">{text}</span>
      <span className="spec-seg__bar" aria-hidden />
    </button>
  )
}

const specs: SpecName[] = ['Guardian', 'Feral', 'Resto', 'Balance']

function RoleSelectorContent({ isPreview = false }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)
  const initialized = useRef(false)

  const getSelectedRoles = () =>
    Object.entries(checkboxMap)
      .filter(([id, item]) => item.checked && specs.includes(id as SpecName))
      .map(([id]) => id)

  useEffect(() => {
    const roles = searchParams.get('roles')
    if (roles) {
      const selectedRoles = roles.split(',')
      specs.forEach((spec) => {
        updateCheckbox(spec, selectedRoles.includes(spec), null)
      })
      const hasDPS = selectedRoles.includes('Balance') || selectedRoles.includes('Feral')
      if (hasDPS && !selectedRoles.includes('DPS')) {
        updateCheckbox('DPS', true, null)
      }
    }
    initialized.current = true
  }, [])

  useEffect(() => {
    if (!initialized.current) return

    const selected = getSelectedRoles()
    const hasDPS = selected.includes('Balance') || selected.includes('Feral')
    if (hasDPS && !checkboxMap['DPS']?.checked) {
      updateCheckbox('DPS', true, null)
    } else if (!hasDPS && checkboxMap['DPS']?.checked) {
      updateCheckbox('DPS', false, null)
    }

    const params = new URLSearchParams(searchParams.toString())
    if (selected.length > 0) {
      const urlRoles = [...selected]
      if (hasDPS) urlRoles.push('DPS')
      params.set('roles', urlRoles.join(','))
    } else {
      params.delete('roles')
    }

    const newUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [checkboxMap, pathname, searchParams, updateCheckbox])

  return (
    <div className="role-selector">
      <div
        className={`spec-bar ${isPreview ? 'spec-bar--preview' : ''}`}
        role="group"
        aria-label="Choose your roles"
      >
        {specs.map((spec) => (
          <SegmentButton key={spec} text={spec} />
        ))}
      </div>
    </div>
  )
}

export default function RoleSelector({ isPreview = false }) {
  return (
    <Suspense
      fallback={
        <div className="role-selector">
          <div className={`spec-bar ${isPreview ? 'spec-bar--preview' : ''}`} aria-hidden>
            {specs.map((spec) => (
              <div key={spec} className="spec-seg spec-seg--loading">
                <span className="spec-seg__icon" />
                <span className="spec-seg__name">{spec}</span>
                <span className="spec-seg__bar" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <RoleSelectorContent isPreview={isPreview} />
    </Suspense>
  )
}
