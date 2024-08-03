import { FaCircleInfo } from 'react-icons/fa6'

export default function Dialog({ children }) {
  return (
    <div className="my-[20px] flex items-center rounded-md bg-blue-300/30 p-4 text-left">
      <FaCircleInfo className="inline" />

      <span className="ml-2">{children}</span>
    </div>
  )
}
