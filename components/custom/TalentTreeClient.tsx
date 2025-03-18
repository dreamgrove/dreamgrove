'use client'
import { useState, useEffect } from 'react'
import { ClassTreeLayout, SpecTreeLayout, HeroTreeLayout } from './TalentTreeLayout'
import {
  TalentNode,
  TalentData,
  base64ToBinaryString,
  BitStreamEncoder,
  getTalentDataForSpec,
  SubTreeEntry,
} from './TalentTreeUtils'

interface NotificationState {
  visible: boolean
  message: string
  type: 'success' | 'error'
}

// This is the client component that handles user interactions and state
export default function TalentTreeClient({
  viewOnly = false,
  talents = '',
}: {
  viewOnly?: boolean
  talents?: string
}) {
  const [classNodes, setClassNodes] = useState<TalentNode[]>([])
  const [specNodes, setSpecNodes] = useState<TalentNode[]>([])
  const [heroNodes, setHeroNodes] = useState<TalentNode[]>([])
  const [selectedClassNodes, setSelectedClassNodes] = useState<number[]>([])
  const [selectedSpecNodes, setSelectedSpecNodes] = useState<number[]>([])
  const [selectedHeroNodes, setSelectedHeroNodes] = useState<number[]>([])
  const [nodeChoices, setNodeChoices] = useState<Map<number, number>>(new Map())
  const [nodeRanks, setNodeRanks] = useState<Map<number, number>>(new Map())
  const [activeTree, setActiveTree] = useState<'class' | 'spec' | 'hero' | 'full'>('full')
  const [talentString, setTalentString] = useState<string>(talents || '')
  const [currentSpecId, setCurrentSpecId] = useState<number>(102) // Default to Balance Druid
  const [importCounter, setImportCounter] = useState<number>(0) // Counter to track imports
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    type: 'success',
  })
  const [copyButtonState, setCopyButtonState] = useState<'ready' | 'copied'>('ready')

  // Sample talent string for testing
  const sampleTalentString =
    'CYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALUmtMGzMwDYWGLzMDwMbjlZ2mxCzMzYWmxMjZM2wCDwAstNWw0MzyIAAAAbmZmZAbGYA'

  // Effect to import talent string if provided via props
  useEffect(() => {
    if (talents && talents.length > 0) {
      setTalentString(talents)
      importTalentString(talents)
    }
  }, [talents])

  useEffect(() => {
    // Find the Druid spec based on the specID (default to Balance - 102)
    const druidData = getTalentDataForSpec(currentSpecId)

    if (druidData) {
      // Get class nodes (shared across all specs)
      setClassNodes(druidData.classNodes)

      // Get spec nodes
      setSpecNodes(druidData.specNodes)

      // Get hero nodes if available
      if (druidData.heroNodes && druidData.heroNodes.length > 0) {
        setHeroNodes(druidData.heroNodes)
      } else {
        console.log('No hero nodes found in the data')
        setHeroNodes([])
      }

      // Only set initial selections if this is not an import (importCounter === 0) and no talents were provided
      if (importCounter === 0 && !talents) {
        // Set some initial selected nodes for testing
        setSelectedClassNodes([
          druidData.classNodes[0].id,
          druidData.classNodes[2].id,
          druidData.classNodes[5].id,
        ])

        // Select a few spec nodes for demonstration
        if (druidData.specNodes.length > 0) {
          setSelectedSpecNodes([
            druidData.specNodes[0].id,
            // Add more initial selections if available
            ...(druidData.specNodes.length > 5 ? [druidData.specNodes[5].id] : []),
            ...(druidData.specNodes.length > 10 ? [druidData.specNodes[10].id] : []),
          ])
        }

        // Select a few hero nodes for demonstration
        if (druidData.heroNodes && druidData.heroNodes.length > 0) {
          setSelectedHeroNodes([
            druidData.heroNodes[0].id,
            ...(druidData.heroNodes.length > 3 ? [druidData.heroNodes[3].id] : []),
          ])
        }
      }
    } else {
      console.error('Could not find Druid data in talents.json')
    }
  }, [currentSpecId, importCounter, talents])

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification.visible])

  const toggleClassNodeSelection = (nodeId: number) => {
    const node = classNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedClassNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedClassNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedClassNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedClassNodes((prev) => [...prev, nodeId])
    }
  }

  const toggleSpecNodeSelection = (nodeId: number) => {
    const node = specNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedSpecNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedSpecNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedSpecNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedSpecNodes((prev) => [...prev, nodeId])
    }
  }

  const toggleHeroNodeSelection = (nodeId: number) => {
    const node = heroNodes.find((n) => n.id === nodeId)
    if (!node) return

    if (selectedHeroNodes.includes(nodeId)) {
      // If the node is already selected, increment its rank up to maxRanks
      const maxRanks = node.maxRanks || 1
      if (maxRanks > 1) {
        setNodeRanks((prev) => {
          const currentRank = prev.get(nodeId) || 1
          const newRanks = new Map(prev)

          if (currentRank < maxRanks) {
            // Increment rank
            newRanks.set(nodeId, currentRank + 1)
          } else {
            // If at max rank, deselect the node
            newRanks.delete(nodeId)
            setSelectedHeroNodes((prev) => prev.filter((id) => id !== nodeId))
          }

          return newRanks
        })
      } else {
        // If node doesn't have multiple ranks, deselect it
        setNodeRanks((prev) => {
          const newRanks = new Map(prev)
          newRanks.delete(nodeId)
          return newRanks
        })
        setSelectedHeroNodes((prev) => prev.filter((id) => id !== nodeId))
      }
    } else {
      // If adding the node, set its rank to 1
      setNodeRanks((prev) => {
        const newRanks = new Map(prev)
        newRanks.set(nodeId, 1)
        return newRanks
      })
      setSelectedHeroNodes((prev) => [...prev, nodeId])
    }
  }

  const isClassNodeSelected = (nodeId: number) => {
    return selectedClassNodes.includes(nodeId)
  }

  const isSpecNodeSelected = (nodeId: number) => {
    return selectedSpecNodes.includes(nodeId)
  }

  const isHeroNodeSelected = (nodeId: number) => {
    return selectedHeroNodes.includes(nodeId)
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({
      visible: true,
      message,
      type,
    })
  }

  // Function to determine if a hero node belongs to the active hero tree
  const determineHeroNodeSubTree = (nodeId: number, allHeroNodes: TalentNode[]) => {
    const node = allHeroNodes.find((n) => n.id === nodeId)
    return node?.subTreeId || 0
  }

  const importTalentString = (talentString: string) => {
    try {
      // Convert from base64 to binary string and extract specID
      const binaryString = base64ToBinaryString(talentString)

      // Extract the specID from the binary string (at bits 8-24)
      const specID = parseInt(binaryString.substring(8, 24), 2)

      // Skip header (152 bits: 8 bits version + 16 bits specID + 128 bits treeHash)
      const headerLength = 152

      // Take everything after the header
      const nodeSelectionBits = binaryString.substring(headerLength)

      // Find the Druid data for the specific spec using the extracted specID
      const druidData = getTalentDataForSpec(specID)

      if (!druidData) {
        console.error(`Could not find Druid data for specID ${specID} in talents.json`)
        return false
      }

      // Check if fullNodeOrder exists and is valid
      if (
        !druidData.fullNodeOrder ||
        !Array.isArray(druidData.fullNodeOrder) ||
        druidData.fullNodeOrder.length === 0
      ) {
        console.error('fullNodeOrder is missing or invalid in the talent data')
        return false
      }

      // Create a map of all nodes by ID for quick lookup
      const nodeMap = new Map<number, TalentNode>()

      // Collect class nodes
      if (druidData.classNodes && Array.isArray(druidData.classNodes)) {
        druidData.classNodes.forEach((node) => {
          if (!nodeMap.has(node.id)) {
            nodeMap.set(node.id, node)
          }
        })
      }

      // Collect spec nodes
      if (druidData.specNodes && Array.isArray(druidData.specNodes)) {
        druidData.specNodes.forEach((node) => {
          if (!nodeMap.has(node.id)) {
            nodeMap.set(node.id, node)
          }
        })
      }

      // Collect hero nodes if they exist
      if (druidData.heroNodes && Array.isArray(druidData.heroNodes)) {
        druidData.heroNodes.forEach((node) => {
          if (!nodeMap.has(node.id)) {
            nodeMap.set(node.id, node)
          }
        })
      }

      // Track subTree information
      let subTreeNodeId: number | undefined
      let subTrees: number[] = []
      let selectedHeroSubTreeId: number | undefined

      if (druidData && druidData.subTreeNodes) {
        subTreeNodeId = druidData.subTreeNodes[0].id
        subTrees = druidData.subTreeNodes[0].entries.map(
          (entry) => (entry as unknown as SubTreeEntry['entries'][0]).traitSubTreeId || 0
        )
      }
      if (druidData.subTreeNodes && Array.isArray(druidData.subTreeNodes)) {
        druidData.subTreeNodes.forEach((node) => {
          if (!nodeMap.has(node.id)) {
            // Cast the node to TalentNode type
            nodeMap.set(node.id, node as unknown as TalentNode)
          }
        })
      }

      // New arrays to store selected nodes
      const newSelectedClassNodes: number[] = []
      const newSelectedSpecNodes: number[] = []
      const newSelectedHeroNodes: number[] = []

      // New map to store choice selections
      const newNodeChoices = new Map<number, number>()

      // New map to store node ranks
      const newNodeRanks = new Map<number, number>()

      // Map to track which hero subTreeIds have selected nodes
      const selectedHeroSubTreeIds = new Set<number>()

      // Process each node in the order specified by fullNodeOrder
      let currentPosition = 0
      let totalSelected = 0

      for (let i = 0; i < druidData.fullNodeOrder.length; i++) {
        const nodeId = druidData.fullNodeOrder[i]
        const node = nodeMap.get(nodeId)

        // Skip if node not found in the map
        if (!node) {
          // Still need to process the bit for this node even if we don't have the node data
          if (currentPosition < nodeSelectionBits.length) {
            const isSelectedBit = nodeSelectionBits.charAt(currentPosition)
            const isNodeSelected = isSelectedBit === '1'
            currentPosition++

            if (isNodeSelected) {
              // Skip additional bits for selected nodes
              // Is Node Purchased (1 bit)
              if (currentPosition < nodeSelectionBits.length) {
                const isPurchasedBit = nodeSelectionBits.charAt(currentPosition)
                const isNodePurchased = isPurchasedBit === '1'
                currentPosition++

                if (isNodePurchased) {
                  // Is Partially Ranked (1 bit)
                  if (currentPosition < nodeSelectionBits.length) {
                    const isPartiallyRankedBit = nodeSelectionBits.charAt(currentPosition)
                    const isPartiallyRanked = isPartiallyRankedBit === '1'
                    currentPosition++

                    if (isPartiallyRanked && currentPosition + 6 <= nodeSelectionBits.length) {
                      // Ranks Purchased (6 bits)
                      currentPosition += 6
                    }
                  }

                  // Is Choice Node (1 bit)
                  if (currentPosition < nodeSelectionBits.length) {
                    const isChoiceNodeBit = nodeSelectionBits.charAt(currentPosition)
                    const isChoiceNode = isChoiceNodeBit === '1'
                    currentPosition++

                    if (isChoiceNode && currentPosition + 2 <= nodeSelectionBits.length) {
                      // Choice Entry Index (2 bits)
                      currentPosition += 2
                    }
                  }
                }
              }
            }
          }

          continue
        }

        // Check if we have enough bits left
        if (currentPosition >= nodeSelectionBits.length) {
          break
        }

        // Is Node Selected (1 bit)
        const isSelectedBit = nodeSelectionBits.charAt(currentPosition)
        const isNodeSelected = isSelectedBit === '1'
        currentPosition++

        // isTargetNode is our choice node for the Hero Talents
        const isTargetNode = nodeId === subTreeNodeId

        if (isNodeSelected) {
          totalSelected++

          // Determine if it's a class, spec or hero node
          const isClassNode = druidData.classNodes.some((classNode) => classNode.id === nodeId)
          const isHeroNode =
            druidData.heroNodes?.some((heroNode) => heroNode.id === nodeId) || false
          const isSpecNode = druidData.specNodes.some((specNode) => specNode.id === nodeId)

          if (isClassNode) {
            newSelectedClassNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          } else if (isHeroNode) {
            // Track which hero subTree this node belongs to
            const heroSubTreeId = determineHeroNodeSubTree(nodeId, druidData.heroNodes || [])
            if (heroSubTreeId) {
              selectedHeroSubTreeIds.add(heroSubTreeId)
            }

            newSelectedHeroNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          } else if (isSpecNode) {
            newSelectedSpecNodes.push(nodeId)
            // Set initial rank to 1
            newNodeRanks.set(nodeId, 1)
          }

          // Is Node Purchased (1 bit)
          const isPurchasedBit = nodeSelectionBits.charAt(currentPosition)
          const isNodePurchased = isPurchasedBit === '1'
          currentPosition++

          if (isNodePurchased) {
            // Is Partially Ranked (1 bit)
            const isPartiallyRankedBit = nodeSelectionBits.charAt(currentPosition)
            const isPartiallyRanked = isPartiallyRankedBit === '1'
            currentPosition++

            if (isPartiallyRanked && currentPosition + 6 <= nodeSelectionBits.length) {
              // Ranks Purchased (6 bits)
              const ranksPurchasedBits = nodeSelectionBits.substring(
                currentPosition,
                currentPosition + 6
              )
              // Reverse the bits before parsing
              const reversedBits = ranksPurchasedBits.split('').reverse().join('')
              const ranksPurchased = parseInt(reversedBits, 2)
              currentPosition += 6

              // Update the node rank based on the ranks purchased
              newNodeRanks.set(nodeId, ranksPurchased)
            } else {
              // If not partially ranked, set to max ranks if available
              const node = nodeMap.get(nodeId)
              if (node && node.maxRanks && node.maxRanks > 1) {
                newNodeRanks.set(nodeId, node.maxRanks)
              }
            }

            // Is Choice Node (1 bit)
            const isChoiceNodeBit = nodeSelectionBits.charAt(currentPosition)
            const isChoiceNode = isChoiceNodeBit === '1'
            currentPosition++

            if (isChoiceNode && currentPosition + 2 <= nodeSelectionBits.length) {
              // Choice Entry Index (2 bits)
              const choiceEntryIndexBits = nodeSelectionBits.substring(
                currentPosition,
                currentPosition + 2
              )
              const choiceEntryIndex = parseInt(
                choiceEntryIndexBits.split('').reverse().join(''),
                2
              )
              currentPosition += 2

              if (isTargetNode) {
                console.log('Sub Trees', subTrees)
                selectedHeroSubTreeId = subTrees[choiceEntryIndex]
              }

              // Update the node choice
              newNodeChoices.set(nodeId, choiceEntryIndex)
            }
          }
        }
      }

      console.log(`Selected hero subTreeIds: ${Array.from(selectedHeroSubTreeIds).join(', ')}`)
      console.log(`Selected hero subTreeId: ${selectedHeroSubTreeId}`)
      // Clean up hero nodes - only include nodes from the chosen hero subTree
      if (selectedHeroSubTreeIds.size > 0 && druidData.heroNodes) {
        // Filter the hero nodes to keep only those from selected subTreeIds
        const filteredHeroNodes = newSelectedHeroNodes.filter((nodeId) => {
          const node = druidData.heroNodes?.find((n) => n.id === nodeId)
          if (
            node?.subTreeId &&
            (!selectedHeroSubTreeIds.has(node.subTreeId) ||
              node.subTreeId !== selectedHeroSubTreeId)
          ) {
            return false
          }
          return true
        })

        if (filteredHeroNodes.length !== newSelectedHeroNodes.length) {
          newSelectedHeroNodes.length = 0 // Clear the array
          newSelectedHeroNodes.push(...filteredHeroNodes) // Add back only the filtered nodes
        }
      }

      // Update the selected nodes state
      if (totalSelected > 0) {
        setSelectedClassNodes(newSelectedClassNodes)
        setSelectedSpecNodes(newSelectedSpecNodes)
        setSelectedHeroNodes(newSelectedHeroNodes)
        setNodeChoices(newNodeChoices)
        setNodeRanks(newNodeRanks)

        // Update the current spec ID to match the imported talent string
        if (specID >= 102 && specID <= 105) {
          setCurrentSpecId(specID)
        }

        // Increment the import counter to trigger a re-render
        setImportCounter((prev) => prev + 1)

        showNotification(`Successfully imported ${totalSelected} talents`, 'success')
      } else {
        showNotification('No talents were selected from the import string', 'error')
      }

      return true
    } catch (error) {
      console.error('Failed to import talent string:', error)
      showNotification('Failed to import talent string', 'error')
      return false
    }
  }

  const exportTalentString = (): string => {
    try {
      // Find the Druid data for the current spec
      const druidData = getTalentDataForSpec(currentSpecId)

      if (!druidData) {
        console.error(`Could not find Druid data for specID ${currentSpecId} in talents.json`)
        return ''
      }

      // Check if fullNodeOrder exists and is valid
      if (
        !druidData.fullNodeOrder ||
        !Array.isArray(druidData.fullNodeOrder) ||
        druidData.fullNodeOrder.length === 0
      ) {
        console.error('fullNodeOrder is missing or invalid in the talent data')
        return ''
      }

      // Create a new BitStream for encoding
      const binaryData = new BitStreamEncoder()

      // Add header information
      // Version (8 bits) - using 9 as current version
      binaryData.addBits(9, 8)

      // Spec ID (16 bits) - using the current spec ID
      binaryData.addBits(currentSpecId, 16)

      // Tree hash (128 bits) - using zeros for simplicity
      for (let i = 0; i < 16; i++) {
        binaryData.addBits(0, 8)
      }

      // Create a map for quick lookup of node types
      const nodeMap = new Map<number, { type: 'class' | 'spec' | 'hero'; node: TalentNode }>()

      // Map class nodes
      druidData.classNodes.forEach((node) => {
        nodeMap.set(node.id, { type: 'class', node })
      })

      // Map spec nodes
      druidData.specNodes.forEach((node) => {
        nodeMap.set(node.id, { type: 'spec', node })
      })

      // Map hero nodes if they exist
      if (druidData.heroNodes) {
        druidData.heroNodes.forEach((node) => {
          nodeMap.set(node.id, { type: 'hero', node })
        })
      }

      // Process nodes in the order specified by fullNodeOrder
      for (const nodeId of druidData.fullNodeOrder) {
        // Check if the node exists in our map
        const nodeInfo = nodeMap.get(nodeId)

        // Check if the node is selected based on its type
        let isSelected = false

        if (nodeInfo) {
          if (nodeInfo.type === 'class') {
            isSelected = selectedClassNodes.includes(nodeId)
          } else if (nodeInfo.type === 'spec') {
            isSelected = selectedSpecNodes.includes(nodeId)
          } else if (nodeInfo.type === 'hero') {
            isSelected = selectedHeroNodes.includes(nodeId)
          }
        }

        // Is node selected?
        binaryData.addBits(isSelected ? 1 : 0, 1)

        if (isSelected) {
          // Is node purchased? (assuming all selected nodes are purchased)
          binaryData.addBits(1, 1)

          // Find the node to check if it has multiple ranks
          const node = nodeInfo?.node

          // Check if this node has multiple ranks and if we have a specific rank set
          const hasMultipleRanks = node && node.maxRanks && node.maxRanks > 1
          const currentRank = nodeRanks.get(nodeId) || 1
          const maxRank = node?.maxRanks || 1

          // Is partially ranked?
          if (hasMultipleRanks && currentRank < maxRank) {
            // Node has multiple ranks and is partially ranked
            binaryData.addBits(1, 1)

            // Add the current rank (6 bits)
            binaryData.addBits(currentRank, 6)
          } else {
            // Node is not partially ranked (either single rank or at max rank)
            binaryData.addBits(0, 1)
          }

          const isChoiceNode = node && node.entries && node.entries.length > 1
          const choiceIndex = nodeChoices.get(nodeId) || 0

          // Is choice node?
          binaryData.addBits(isChoiceNode ? 1 : 0, 1)

          if (isChoiceNode) {
            // Choice Entry Index (2 bits)
            binaryData.addBits(choiceIndex, 2)
          }
        }
      }

      // Convert to Base64 and add 'C' prefix for class talents
      const base64String = 'C' + binaryData.toBase64()
      return base64String
    } catch (error) {
      console.error('Failed to export talent string:', error)
      return ''
    }
  }

  const resetSelections = () => {
    setSelectedClassNodes([])
    setSelectedSpecNodes([])
    setSelectedHeroNodes([])
    setNodeRanks(new Map())
    setNodeChoices(new Map())
  }

  const showAllHeroTalents = () => {
    // Set the active tree to hero
    setActiveTree('hero')

    // Select ALL nodes from each subTree to show all hero trees
    const nodesToSelect: number[] = []
    const newNodeRanks = new Map<number, number>()

    // Group nodes by subTreeId
    const nodesBySubTree = new Map()
    heroNodes.forEach((node) => {
      if (node.subTreeId) {
        if (!nodesBySubTree.has(node.subTreeId)) {
          nodesBySubTree.set(node.subTreeId, [])
        }
        nodesBySubTree.get(node.subTreeId).push(node)
      } else {
        // Include nodes without subTreeId
        nodesToSelect.push(node.id)
        // Set rank to maxRanks if available, otherwise 1
        const maxRank = node.maxRanks || 1
        newNodeRanks.set(node.id, maxRank)
      }
    })

    // Add all nodes from each subTree
    nodesBySubTree.forEach((nodes) => {
      nodes.forEach((node) => {
        nodesToSelect.push(node.id)
        // Set rank to maxRanks if available, otherwise 1
        const maxRank = node.maxRanks || 1
        newNodeRanks.set(node.id, maxRank)
      })
    })

    setSelectedHeroNodes(nodesToSelect)
    setNodeRanks(newNodeRanks)
  }

  const handleTalentStringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTalentString(e.target.value)
  }

  const handleImportClick = () => {
    if (talentString) {
      importTalentString(talentString)
    }
  }

  const handleExportClick = () => {
    const exportedString = exportTalentString()
    setTalentString(exportedString)

    // Copy to clipboard
    navigator.clipboard
      .writeText(exportedString)
      .then(() => {
        showNotification('Talent string copied to clipboard!', 'success')
      })
      .catch((err) => {
        console.error('Failed to copy talent string:', err)
        showNotification('Failed to copy talent string', 'error')
      })
  }

  const handleSampleClick = () => {
    setTalentString(sampleTalentString)
    importTalentString(sampleTalentString)
  }

  const handleTreeChange = (tree: 'class' | 'spec' | 'hero' | 'full') => {
    setActiveTree(tree)
  }

  const handleCopyTalentString = () => {
    // Copy the talent string to clipboard
    if (talents) {
      navigator.clipboard
        .writeText(talents)
        .then(() => {
          setCopyButtonState('copied')
          setTimeout(() => setCopyButtonState('ready'), 2000) // Reset after 2 seconds
        })
        .catch((err) => {
          console.error('Failed to copy talent string:', err)
          showNotification('Failed to copy talent string', 'error')
        })
    }
  }

  // Determine which trees to show based on activeTree
  const showClassTree = activeTree === 'class' || activeTree === 'full'
  const showSpecTree = activeTree === 'spec' || activeTree === 'full'
  const showHeroTree = activeTree === 'hero' || activeTree === 'full'

  // Convert Map to Record for passing to server components
  const nodeChoicesRecord = Object.fromEntries(nodeChoices)
  const nodeRanksRecord = Object.fromEntries(nodeRanks)

  // Calculate the width classes based on which trees are visible
  const getWidthClass = () => {
    const visibleCount = [showClassTree, showSpecTree, showHeroTree].filter(Boolean).length

    if (visibleCount === 3) {
      // Class and Spec get 40% each, Hero gets 20%
      return {
        classWidth: 'w-[9/19]',
        specWidth: 'w-[3/19]',
        heroWidth: 'w-[7/19]',
      }
    } else if (visibleCount === 2) {
      // 50% each for two trees
      return {
        classWidth: 'w-1/2',
        specWidth: 'w-1/2',
        heroWidth: 'w-1/2',
      }
    } else {
      // 100% for a single tree
      return {
        classWidth: 'w-full',
        specWidth: 'w-full',
        heroWidth: 'w-full',
      }
    }
  }

  const { classWidth, specWidth, heroWidth } = getWidthClass()

  // Placeholder return with minimal structure
  // We'll expand on the UI in subsequent edits
  return (
    <div className="flex flex-col gap-4">
      {!viewOnly ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={talentString}
                onChange={handleTalentStringChange}
                placeholder="Paste talent string here..."
                className="flex-1 rounded-md border border-gray-600 bg-gray-800 p-2 text-white"
              />
              <button
                onClick={handleImportClick}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Import
              </button>
              <button
                onClick={handleExportClick}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Export
              </button>
              <button
                onClick={resetSelections}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTreeChange('full')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'full'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Full Tree
                </button>
                <button
                  onClick={() => handleTreeChange('class')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'class'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Class Tree
                </button>
                <button
                  onClick={() => handleTreeChange('spec')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'spec'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Spec Tree
                </button>
                <button
                  onClick={() => handleTreeChange('hero')}
                  className={`rounded px-3 py-1 ${
                    activeTree === 'hero'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  }`}
                >
                  Hero Tree
                </button>
              </div>
              <button
                onClick={handleSampleClick}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Use sample talent string
              </button>
            </div>
          </div>
        </>
      ) : (
        // In viewOnly mode, only show the tree navigation buttons
        <div className="flex space-x-2">
          <button
            onClick={() => handleTreeChange('full')}
            className={`rounded px-3 py-1 ${
              activeTree === 'full'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Full Tree
          </button>
          <button
            onClick={() => handleTreeChange('class')}
            className={`rounded px-3 py-1 ${
              activeTree === 'class'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Class Tree
          </button>
          <button
            onClick={() => handleTreeChange('spec')}
            className={`rounded px-3 py-1 ${
              activeTree === 'spec'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Spec Tree
          </button>
          <button
            onClick={() => handleTreeChange('hero')}
            className={`rounded px-3 py-1 ${
              activeTree === 'hero'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
            }`}
          >
            Hero Tree
          </button>
        </div>
      )}

      {notification.visible && (
        <div
          className={`rounded-md p-3 ${
            notification.type === 'success' ? 'bg-green-800' : 'bg-red-800'
          }`}
        >
          <p className="text-white">{notification.message}</p>
        </div>
      )}

      <div className="flex h-auto w-full ">
        {/* Dynamic layout based on which trees are visible */}
        <div className="flex h-full w-full">
          {showClassTree && (
            <div className={`h-full ${classWidth} p-2`}>
              <ClassTreeLayout
                nodes={classNodes}
                selectedNodes={selectedClassNodes}
                nodeChoices={nodeChoicesRecord}
                nodeRanks={nodeRanksRecord}
                viewOnly={viewOnly}
              />
            </div>
          )}

          {showHeroTree && (
            <div className={`h-full ${heroWidth} p-2`}>
              <HeroTreeLayout
                nodes={heroNodes}
                selectedNodes={selectedHeroNodes}
                nodeChoices={nodeChoicesRecord}
                nodeRanks={nodeRanksRecord}
                viewOnly={viewOnly}
              />
            </div>
          )}

          {showSpecTree && (
            <div className={`h-full ${specWidth} p-2`}>
              <SpecTreeLayout
                nodes={specNodes}
                selectedNodes={selectedSpecNodes}
                nodeChoices={nodeChoicesRecord}
                nodeRanks={nodeRanksRecord}
                viewOnly={viewOnly}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add button to copy talent string */}
      {talents && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleCopyTalentString}
            className={`rounded-md px-4 py-2 text-white transition-all duration-300 ${
              copyButtonState === 'copied'
                ? 'scale-105 animate-pulse bg-yellow-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            {copyButtonState === 'copied' ? 'Copied to Clipboard!' : 'Copy Talent String'}
          </button>
        </div>
      )}
    </div>
  )
}
