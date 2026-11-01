'use client'

import type { TreeView } from './TalentTreeModel'
import type { PageLocale } from '@/lib/pageLocale'
import { buildWowheadUrl } from '@/lib/wowhead/urls'

const SELECTED = '#00ff00'
const UNSELECTED = '#ffd700'

export default function TalentTreeView({ tree, locale }: { tree: TreeView; locale?: PageLocale }) {
  const { title, rows, cols, nodes, lines, interactive, message } = tree

  return (
    <div className="flex h-full w-full flex-col">
      <h2 className="mt-0 mb-2 text-center text-xl font-bold text-yellow-400">{title}</h2>
      {message ? (
        <div className="flex flex-1 items-center justify-center">
          {message.detail ? (
            <div className="rounded-lg bg-gray-800 p-6 text-center">
              <p className="text-lg text-white">{message.title}</p>
              <p className="mt-2 text-gray-400">{message.detail}</p>
            </div>
          ) : (
            <div className="text-white">{message.title}</div>
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full w-full items-center justify-center overflow-hidden">
            <div
              className="relative w-full"
              style={{ maxWidth: `${cols * 70}px`, maxHeight: `${rows * 70}px` }}
            >
              <svg
                className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
                viewBox={`0 0 ${cols} ${rows}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {lines.map((line, i) => (
                  <line
                    key={i}
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke={line.active ? SELECTED : UNSELECTED}
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                    opacity={line.active ? 0.6 : 0.2}
                    style={
                      line.active
                        ? { filter: 'drop-shadow(0 0 3px rgba(0, 255, 0, 0.5))' }
                        : undefined
                    }
                  />
                ))}
              </svg>

              <div
                className="grid h-auto w-full"
                style={{
                  aspectRatio: cols / rows,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 70px))`,
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 70px))`,
                }}
              >
                {nodes.map((node) => {
                  const span = node.span ?? 1
                  return (
                    <div
                      key={node.id}
                      className="relative flex w-full items-center justify-center"
                      style={{
                        gridRow: node.row + 1,
                        gridColumn: `${node.col + 1} / span ${span}`,
                        ...(span > 1 && { justifySelf: 'center', width: `${100 / span}%` }),
                      }}
                      data-node-id={node.id}
                    >
                      <div
                        className={`absolute z-10 flex h-[70%] w-[70%] items-center justify-center rounded-full border-2 opacity-80 transition-all duration-200 ${
                          interactive ? 'cursor-pointer hover:scale-110 hover:border-white' : ''
                        }`}
                        style={{
                          borderColor: node.border || (node.selected ? SELECTED : UNSELECTED),
                        }}
                        title={node.name}
                      >
                        {node.icon && (
                          <>
                            <a
                              href={buildWowheadUrl(
                                'spell',
                                node.spellId || 0,
                                undefined,
                                false,
                                locale
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-[90%] w-[90%] items-center justify-center"
                            >
                              {/* Plain <img>: these 56px CDN icons gain nothing from next/image */}
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${node.icon}.jpg`}
                                alt={node.name}
                                width={56}
                                height={56}
                                loading="lazy"
                                decoding="async"
                                className={`rounded-full ${
                                  node.selected
                                    ? 'brightness-125'
                                    : 'opacity-70 brightness-50 grayscale-50'
                                }`}
                              />
                            </a>
                            {node.maxRanks && (
                              <div
                                className={`absolute right-0 bottom-0 z-[11] rounded-full border bg-black px-1 text-[0.65rem] font-bold ${
                                  node.selected
                                    ? 'border-[#ffcc00] text-white shadow-[0_0_3px_rgba(255,204,0,0.5)]'
                                    : 'border-[#666] text-gray-400'
                                }`}
                              >
                                {node.rank}/{node.maxRanks}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
