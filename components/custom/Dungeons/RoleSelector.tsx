'use client'
import balanceIcon from '../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../public/static/images/icons/guardian.jpg'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useState, Suspense, useContext } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { CheckboxContext } from '../CheckboxProvider'

const IconDisplay = ({ text }) => {
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)
  const isChecked = checkboxMap[text]?.checked || false

  const handleClick = () => {
    // Toggle the checkbox state
    updateCheckbox(text, !isChecked, null)
  }

  let imgSrc: StaticImageData
  switch (text) {
    case 'Feral':
      imgSrc = feralIcon
      break
    case 'Guardian':
      imgSrc = guardianIcon
      break
    case 'Resto':
      imgSrc = restoIcon
      break
    case 'Balance':
      imgSrc = balanceIcon
      break
    default:
      throw Error('Invalid type of Icon provided')
  }

  return (
    <div
      className={`cursor-pointer rounded-md border-2 select-none ${isChecked ? 'border-main' : 'border-main/20'} flex items-center p-1`}
      onClick={handleClick}
    >
      <div className="shrink-0">
        <Image
          className={`my-0 inline-block h-auto w-7 rounded-md sm:w-8 md:w-9 lg:w-10 ${isChecked ? 'opacity-100' : 'opacity-20'}`}
          src={imgSrc}
          alt={`${text} icon`}
          width={40}
          height={40}
        />
      </div>
      <span
        className={`ml-2 align-middle text-base sm:text-lg md:text-xl ${isChecked ? 'text-white' : 'text-white/20'}`}
      >
        {text}
      </span>
    </div>
  )
}

const specs = ['Guardian', 'Feral', 'Resto', 'Balance']

function RoleSelectorContent({ isPreview = false }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { checkboxMap, updateCheckbox } = useContext(CheckboxContext)

  // Get selected roles based on checkbox states
  const getSelectedRoles = () => {
    return Object.entries(checkboxMap)
      .filter(([id, item]) => item.checked && specs.includes(id))
      .map(([id]) => id)
  }

  // Initialize checkboxes from URL parameters
  useEffect(() => {
    const roles = searchParams.get('roles')
    if (roles) {
      const selectedRoles = roles.split(',')
      specs.forEach((spec) => {
        updateCheckbox(spec, selectedRoles.includes(spec), null)
      })

      // Handle DPS state
      const hasDPS = selectedRoles.includes('Balance') || selectedRoles.includes('Feral')
      if (hasDPS && !selectedRoles.includes('DPS')) {
        updateCheckbox('DPS', true, null)
      }
    }
  }, [])

  // Update URL when selected roles change
  useEffect(() => {
    const selected = getSelectedRoles()

    // Add DPS if Balance or Feral is selected
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
    <div className="roleSelector mt-4 flex flex-col items-center">
      <div className="text-xl">Choose your roles:</div>
      <div
        className={`buttons flex w-full flex-col items-center justify-center space-y-3 py-4 lg:flex-row lg:space-y-0 lg:space-x-3 lg:py-0 ${isPreview ? 'md:flex-col md:space-y-3 md:space-x-0 md:py-4' : 'md:h-24 md:flex-row md:space-y-0 md:space-x-3 md:py-0'}`}
      >
        {specs.map((spec) => (
          <div key={spec} className="w-full flex-1">
            <IconDisplay text={spec} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function RoleSelector({ isPreview = false }) {
  return (
    <Suspense
      fallback={
        <div className="mt-4 flex flex-col items-center">
          <div className="text-xl">Choose your roles:</div>
          <div
            className={`buttons flex w-full flex-col items-center justify-center space-y-3 py-4 lg:flex-row lg:space-y-0 lg:space-x-3 lg:py-0 ${isPreview ? 'md:flex-col md:space-y-3 md:space-x-0 md:py-4' : 'md:h-24 md:flex-row md:space-y-0 md:space-x-3 md:py-0'}`}
          >
            {specs.map((spec) => (
              <div key={spec} className="w-full flex-1">
                <div className="border-main/20 flex cursor-pointer items-center rounded-md border-2 p-1 select-none">
                  <div className="shrink-0">
                    <div className="inline-block h-7 w-7 rounded-md bg-gray-700 opacity-20 sm:w-8 md:w-9 lg:w-10" />
                  </div>
                  <span className="ml-2 align-middle text-base text-white/20 sm:text-lg md:text-xl">
                    {spec}
                  </span>
                </div>
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
