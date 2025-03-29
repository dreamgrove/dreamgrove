/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import balanceIcon from '../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../public/static/images/icons/guardian.jpg'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

const toggleText = (state, id, selected) => {
  console.log('Current selected roles:', selected)

  // Handle elements with logical operators (&&)
  const logicalElements = document.querySelectorAll<HTMLElement>(`[id*="&&"]`)
  console.log('Found logical elements:', logicalElements.length)
  logicalElements.forEach((element) => {
    console.log('Processing logical element:', element.id)
    // Strip any suffixes (numbers after hyphens) from the ID before splitting
    const baseId = element.id.replace(/-\d+$/, '')
    const conditions = baseId.split('&&')
    console.log('Conditions:', conditions)
    const shouldShow = conditions.every((condition) => {
      const trimmed = condition.trim()
      console.log('Checking condition:', trimmed, 'Selected includes:', selected.includes(trimmed))
      return selected.includes(trimmed)
    })
    console.log('Should show:', shouldShow)
    element.style.display = shouldShow ? 'list-item' : 'none'
  })

  // Handle elements with OR operator (||)
  const orElements = document.querySelectorAll<HTMLElement>(`[id*="||"]`)
  console.log('Found OR elements:', orElements.length)
  orElements.forEach((element) => {
    console.log('Processing OR element:', element.id)
    // Strip any suffixes (numbers after hyphens) from the ID before splitting
    const baseId = element.id.replace(/-\d+$/, '')
    const conditions = baseId.split('||')
    console.log('Conditions:', conditions)
    const shouldShow = conditions.some((condition) => {
      const trimmed = condition.trim()
      console.log('Checking condition:', trimmed, 'Selected includes:', selected.includes(trimmed))
      return selected.includes(trimmed)
    })
    console.log('Should show:', shouldShow)
    element.style.display = shouldShow ? 'list-item' : 'none'
  })

  // Handle regular elements
  const elements = document.querySelectorAll<HTMLElement>(`[id^="${id}"]`)
  console.log('Found regular elements:', elements.length)
  const negativeElements = document.querySelectorAll<HTMLElement>(`[id^="~${id}"]`)
  console.log('Found negative elements:', negativeElements.length)

  elements.forEach((element) => {
    if (!element.id.includes('&&') && !element.id.includes('||')) {
      console.log('Processing regular element:', element.id)
      element.style.display = state ? 'list-item' : 'none'
    }
  })
  negativeElements.forEach((element) => {
    if (!element.id.includes('&&') && !element.id.includes('||')) {
      console.log('Processing negative element:', element.id)
      element.style.display = state ? 'none' : 'list-item'
    }
  })
}

const IconDisplay = ({ text, setSelected, isSelected }) => {
  const [clicked, setClicked] = useState(isSelected)

  // Sync clicked state with isSelected prop changes
  useEffect(() => {
    setClicked(isSelected)
  }, [isSelected])

  useEffect(() => {
    if (clicked) {
      setSelected((prevSelected) => {
        // Only add if not already present
        if (prevSelected.includes(text)) return prevSelected

        const newSelected = [...prevSelected, text]
        if (text === 'Balance' || text === 'Feral') {
          if (!prevSelected.includes('DPS')) {
            newSelected.push('DPS')
          }
        }
        return newSelected
      })
    } else {
      setSelected((prevSelected) => {
        let newSelected = prevSelected.filter((item) => item !== text)
        if (text === 'Balance' || text === 'Feral') {
          if (!newSelected.includes('Balance') && !newSelected.includes('Feral'))
            newSelected = newSelected.filter((item) => item !== 'DPS')
        }
        return newSelected
      })
    }
  }, [clicked])

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
      className={`cursor-pointer select-none rounded-md border-2 ${clicked ? 'border-main' : 'border-main/20'} p-1`}
      onClick={() => setClicked((s) => !s)}
    >
      <Image
        className={`inline-block rounded-md  ${clicked ? 'opacity-100' : 'opacity-20'}`}
        src={imgSrc}
        alt={`${text} icon`}
        width={40}
        height={40}
      />
      <span className={`ml-2 align-sub text-xl ${clicked ? 'text-white' : 'text-white/20'}`}>
        {text}
      </span>
    </div>
  )
}

const specs = ['Guardian', 'Feral', 'Resto', 'Balance']

export default function RoleSelector() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  // Initialize selected roles from URL parameters
  useEffect(() => {
    const roles = searchParams.get('roles')
    if (roles) {
      const selectedRoles = roles.split(',')
      setSelected(selectedRoles)
    }
  }, [searchParams])

  // Update URL when selected roles change
  useEffect(() => {
    if (selected.length > 0) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('roles', selected.join(','))
      router.push(`?${params.toString()}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('roles')
      router.push(`?${params.toString()}`)
    }
  }, [selected, router, searchParams])

  useEffect(() => {
    const addDps = [...specs, 'DPS']
    addDps.forEach((spec) => {
      toggleText(selected.includes(spec), spec, selected)
    })
  }, [selected])

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="text-xl">Choose your roles:</div>
      <div className="flex w-full flex-col items-center justify-center space-y-3 py-4 sm:h-auto md:h-24 md:flex-row md:space-x-3 md:space-y-0 md:py-0">
        {specs.map((spec) => (
          <div key={spec} className="w-full flex-1">
            <IconDisplay
              setSelected={setSelected}
              text={spec}
              isSelected={selected.includes(spec)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
