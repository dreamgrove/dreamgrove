// Raid encounters with Warcraft Logs boss-ability data, by WCL encounter id.
// Used by the planner's encounter picker and the guide planner embed.
export interface EncounterOption {
  id: string
  name: string
}

export const ENCOUNTERS: EncounterOption[] = [
  { id: '3470', name: "Nek'zali the Soulcoiler" },
  { id: '3445', name: 'Entombed Sentinels' },
  { id: '3455', name: 'Vashnik the Malignant' },
  { id: '3497', name: 'The Lost Explorers' },
  { id: '3420', name: 'Sszorak' },
  { id: '3421', name: 'The Twin Fangs' },
  { id: '3429', name: 'The Coiled Altar' },
  { id: '3492', name: "Ula'tek" },
]
