import { FaCircleInfo } from 'react-icons/fa6'
import { CiWarning } from 'react-icons/ci'

function getColor(type) {
  switch (type) {
    case 'warning':
      return 'bg-yellow-300/30'
    default:
      return 'bg-blue-300/30'
  }
}

function getIcon(type) {
  const className = 'inline text-4xl lg:text-3xl shrink-0'
  switch (type) {
    case 'warning':
      return <CiWarning className={className} />
    default:
      return <FaCircleInfo className={className} />
  }
}
export default function Dialog({ children, type = 'info' }) {
  const color = getColor(type)
  return (
    <div className={`my-6 flex items-center rounded-md ${color} p-4 text-left`}>
      {getIcon(type)}
      <span className="ml-4 break-words">{children}</span>
    </div>
  )
}
