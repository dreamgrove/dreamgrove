import { LuSwords } from 'react-icons/lu'
import { LuShield } from 'react-icons/lu'
import { GiHealthNormal } from 'react-icons/gi'
import Checkbox from '../Checkbox'

export default function RoleSelector() {
  return (
    <div className="mt-8 flex flex-col items-center">
      <div>Choose your roles</div>
      <div className="flex h-24 items-center justify-center">
        <div className="flex space-x-10">
          <div className="text-center">
            <Checkbox id="Tank">
              <LuShield className="inline h-12 w-12" />
            </Checkbox>
          </div>
          <div className="text-center">
            <Checkbox id="DPS">
              <LuSwords className="inline h-12 w-12" />
            </Checkbox>
          </div>
          <div className="text-center">
            <Checkbox id="Healer">
              <GiHealthNormal className="inline h-12 w-12" />
            </Checkbox>
          </div>
        </div>
      </div>
    </div>
  )
}
