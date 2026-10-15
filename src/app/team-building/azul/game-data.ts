export type CheckpointId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5'
export type RouteCheckpoint = CheckpointId | 'P1' | 'P2' | 'P3' | 'P4' | 'P5'

export type DigitalChallenge = {
  id: CheckpointId
  title: string
  kicker: string
  intro: string
  prompt: string
  answer: string
  placeholder: string
  hint1: string
  hint2: string
  reveal: string
  points: { base: number; hint1: number; hint2: number; reveal: number }
  code?: string
  chips?: string[]
  symbolOrder?: string[]
}

export const challenges: Record<CheckpointId, DigitalChallenge> = {
  D1: {
    id: 'D1',
    title: 'The Lost Message',
    kicker: 'Checkpoint D1',
    intro: 'A short word was pushed out of place before it reached you. Bring it back.',
    prompt: 'Every letter travelled the same distance through the alphabet. Recover the original word.',
    code: 'DGCEJ',
    answer: 'BEACH',
    placeholder: 'Enter the hidden word',
    hint1: 'The letters all moved in the same direction and by the same number of places.',
    hint2: 'Move every letter two places backwards in the alphabet. D becomes B.',
    reveal: 'DGCEJ becomes BEACH.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D2: {
    id: 'D2',
    title: 'Eyes Open',
    kicker: 'Checkpoint D2',
    intro: 'The place around you is part of the puzzle. Read it carefully.',
    prompt: 'Count the main vertical supports of the structure in front of this QR. Double that number, then subtract 3. What remains?',
    answer: '13',
    placeholder: 'Enter the final number',
    hint1: 'Use only the main structural supports. Ignore railings and decorative elements.',
    hint2: 'For the current setup, there are 8 supports. Now apply the calculation in the riddle.',
    reveal: '8 × 2 = 16, and 16 − 3 = 13.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D3: {
    id: 'D3',
    title: 'Four Symbols',
    kicker: 'Checkpoint D3',
    intro: 'Four symbols are out of place. Restore their order and a four-digit key will appear.',
    prompt: 'PALM stands first. SHELL follows WAVE without anything between them. SUN comes before WAVE. WAVE refuses second place.',
    answer: '2749',
    placeholder: 'Enter the 4-digit key',
    hint1: 'Begin with the clue that fixes one symbol in an exact position.',
    hint2: 'PALM is first. SUN must be before WAVE, and SHELL must touch WAVE from the right.',
    reveal: 'PALM → SUN → WAVE → SHELL. The key is 2749.',
    chips: ['PALM = 2', 'SUN = 7', 'WAVE = 4', 'SHELL = 9'],
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D4: {
    id: 'D4',
    title: 'The Hidden Four',
    kicker: 'Checkpoint D4',
    intro: 'Four signs are hiding close to where you stand. Each guards a single number.',
    prompt: 'Find them. When all four are yours, read their numbers in this order:',
    answer: '6381',
    placeholder: 'Enter the 4-digit key',
    hint1: 'The four signs are all nearby. You should not need to go farther than about 20 metres.',
    hint2: 'Look high, low and behind fixed objects. Nothing needs to be moved.',
    reveal: 'SUN = 6, PALM = 3, WAVE = 8, STAR = 1. The key is 6381.',
    symbolOrder: ['SUN', 'PALM', 'WAVE', 'STAR'],
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D5: {
    id: 'D5',
    title: 'The Missing Step',
    kicker: 'Checkpoint D5',
    intro: 'The sequence keeps changing its pace, but not at random.',
    prompt: '4  ·  8  ·  15  ·  25  ·  38  ·  ?',
    answer: '54',
    placeholder: 'Enter the missing number',
    hint1: 'Look at the size of each jump between neighbouring numbers.',
    hint2: 'The jumps are +4, +7, +10, +13. The jump itself grows by 3 each time.',
    reveal: 'The next jump is +16, so 38 + 16 = 54.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
}

export const teamRoutes: Record<string, RouteCheckpoint[]> = {
  AZUL01: ['P1', 'D1', 'P2', 'D3', 'P3', 'D5', 'P4', 'D2', 'P5', 'D4'],
  AZUL02: ['D1', 'P2', 'D3', 'P3', 'D5', 'P4', 'D2', 'P5', 'D4', 'P1'],
  AZUL03: ['P2', 'D3', 'P3', 'D5', 'P4', 'D2', 'P5', 'D4', 'P1', 'D1'],
  AZUL04: ['D3', 'P3', 'D5', 'P4', 'D2', 'P5', 'D4', 'P1', 'D1', 'P2'],
  AZUL05: ['P3', 'D5', 'P4', 'D2', 'P5', 'D4', 'P1', 'D1', 'P2', 'D3'],
  AZUL06: ['D5', 'P4', 'D2', 'P5', 'D4', 'P1', 'D1', 'P2', 'D3', 'P3'],
  AZUL07: ['P4', 'D2', 'P5', 'D4', 'P1', 'D1', 'P2', 'D3', 'P3', 'D5'],
  AZUL08: ['D2', 'P5', 'D4', 'P1', 'D1', 'P2', 'D3', 'P3', 'D5', 'P4'],
  AZUL09: ['P5', 'D4', 'P1', 'D1', 'P2', 'D3', 'P3', 'D5', 'P4', 'D2'],
  AZUL10: ['D4', 'P1', 'D1', 'P2', 'D3', 'P3', 'D5', 'P4', 'D2', 'P5'],
}

export const checkpointLabels: Record<RouteCheckpoint, string> = {
  P1: 'Ball Harvest',
  P2: 'Water Relay',
  P3: 'Balloon Transport',
  P4: 'Team Crane',
  P5: 'Uroš Mobile Challenge',
  D1: 'The Lost Message',
  D2: 'Eyes Open',
  D3: 'Four Symbols',
  D4: 'The Hidden Four',
  D5: 'The Missing Step',
}

export const locationHints: Record<RouteCheckpoint, string> = {
  P1: 'Find the Game Master at Physical Checkpoint P1 - Ball Harvest.',
  P2: 'Find the Game Master at Physical Checkpoint P2 - Water Relay.',
  P3: 'Find the Game Master at Physical Checkpoint P3 - Balloon Transport.',
  P4: 'Find the Game Master at Physical Checkpoint P4 - Team Crane.',
  P5: 'Find Uroš and the mobile physical challenge.',
  D1: 'Find the QR marker for Digital Checkpoint D1.',
  D2: 'Find the QR marker for Digital Checkpoint D2.',
  D3: 'Find the QR marker for Digital Checkpoint D3.',
  D4: 'Find the QR marker for Digital Checkpoint D4.',
  D5: 'Find the QR marker for Digital Checkpoint D5.',
}

export function normalizeTeamCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export function normalizeAnswer(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, ' ')
}

export function getDigitalSequence(teamCode: string): CheckpointId[] {
  return (teamRoutes[teamCode] || []).filter((item): item is CheckpointId => item.startsWith('D'))
}

export function getNextCheckpoint(teamCode: string, current: CheckpointId): RouteCheckpoint | null {
  const route = teamRoutes[teamCode]
  if (!route) return null
  const index = route.indexOf(current)
  if (index < 0 || index === route.length - 1) return null
  return route[index + 1]
}
