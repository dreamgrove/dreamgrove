'use client'
import { useEffect, useState } from 'react'
import talentData from '../../other/talents.json'

interface TalentNode {
  id: number
  name: string
  type: string
  posX: number
  posY: number
  next: number[]
  entries: {
    icon: string
    name: string
  }[]
}

interface TalentData {
  className: string
  specName: string
  classNodes: TalentNode[]
}

export default function TalentTree() {
  const [nodes, setNodes] = useState<TalentNode[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    // Get the Balance Druid spec (first item in array)
    const balanceDruid = talentData.find(
      (spec) => spec.className === 'Druid' && spec.specName === 'Balance'
    )
    if (balanceDruid) {
      setNodes(balanceDruid.classNodes)

      // Calculate container dimensions based on node positions
      const maxX = Math.max(...balanceDruid.classNodes.map((node) => node.posX))
      const maxY = Math.max(...balanceDruid.classNodes.map((node) => node.posY))
      const minX = Math.min(...balanceDruid.classNodes.map((node) => node.posX))
      const minY = Math.min(...balanceDruid.classNodes.map((node) => node.posY))

      console.log('Coordinates:', {
        maxX,
        maxY,
        minX,
        minY,
      })

      setDimensions({
        width: (maxX - minX) / 8 + 100,
        height: (maxY - minY) / 8 + 100,
      })
    }
  }, [])

  const getNodePosition = (node: TalentNode) => {
    const x = (node.posX - 1500) / 8 + 50
    const y = (node.posY - 1500) / 8 + 50
    console.log('Node Position:', {
      id: node.id,
      name: node.name,
      originalX: node.posX,
      originalY: node.posY,
      calculatedX: x,
      calculatedY: y,
    })
    return { x, y }
  }

  return (
    <div
      className="relative bg-black"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
      }}
    >
      <svg className="absolute h-full w-full">
        {nodes.map((node) => {
          const start = getNodePosition(node)
          return node.next?.map((nextId) => {
            const endNode = nodes.find((n) => n.id === nextId)
            if (endNode) {
              const end = getNodePosition(endNode)
              return (
                <line
                  key={`${node.id}-${nextId}`}
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#ffd700"
                  strokeWidth="2"
                  opacity="0.5"
                />
              )
            }
            return null
          })
        })}
      </svg>

      {nodes.map((node) => {
        const { x, y } = getNodePosition(node)
        return (
          <div
            key={node.id}
            className="absolute flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-400 bg-gray-800"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {node.entries[0]?.icon && (
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${node.entries[0].icon}.jpg`}
                alt={node.name}
                className="h-10 w-10 rounded-full"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
