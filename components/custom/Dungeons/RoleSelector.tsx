/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client'
import balanceIcon from '../../../public/static/images/icons/balance.jpg'
import restoIcon from '../../../public/static/images/icons/resto.jpg'
import feralIcon from '../../../public/static/images/icons/feral.jpg'
import guardianIcon from '../../../public/static/images/icons/guardian.jpg'
import Image, { StaticImageData } from 'next/image'
import { useEffect, useState } from 'react'

const toggleText = (state, id) => {
  const elements = document.querySelectorAll<HTMLElement>(`[id^="${id}"]`)
  const negativeElements = document.querySelectorAll<HTMLElement>(`[id^="~${id}"]`)
  elements.forEach((element) => {
    element.style.display = state ? 'list-item' : 'none'
  })
  negativeElements.forEach((element) => {
    element.style.display = state ? 'none' : 'list-item'
  })
}

const IconDisplay = ({ text, setSelected }) => {
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    if (clicked) {
      setSelected((prevSelected) => {
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
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const addDps = [...specs, 'DPS']
    addDps.forEach((spec) => {
      toggleText(selected.includes(spec), spec)
    })
  }, [selected])

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="text-xl">Choose your roles:</div>
      <div className="flex w-full flex-col items-center justify-center space-y-3 py-4 sm:h-auto md:h-24 md:flex-row md:space-x-3 md:space-y-0 md:py-0">
        {specs.map((spec) => (
          <div key={spec} className="w-full flex-1">
            <IconDisplay setSelected={setSelected} text={spec} />
          </div>
        ))}
      </div>
    </div>
  )
}
