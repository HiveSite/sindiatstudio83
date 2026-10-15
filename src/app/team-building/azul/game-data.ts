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
    title: 'Crack the Code',
    kicker: 'Cipher challenge',
    intro: 'Someone left your team a message, but every letter has been moved one step forward in the alphabet.',
    prompt: 'Decode the message and enter the hidden word.',
    code: 'CFBDI',
    answer: 'BEACH',
    placeholder: 'Enter the secret word',
    hint1: 'Move every letter one position backwards in the alphabet.',
    hint2: 'C becomes B, F becomes E…',
    reveal: 'The decoded word is BEACH.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D2: {
    id: 'D2',
    title: 'Look Around',
    kicker: 'Observation challenge',
    intro: 'The answer is not on your phone. Everything you need is in the space around this QR code.',
    prompt: 'Count the vertical support posts of the structure directly in front of this QR code. Enter the total number.',
    answer: '8',
    placeholder: 'Enter a number',
    hint1: 'Stay within approximately 20 metres of the QR code.',
    hint2: 'Count only the main vertical support posts, not railings or decorative elements.',
    reveal: 'The current setup answer is 8. This checkpoint should be re-checked on site before the event.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D3: {
    id: 'D3',
    title: 'Find the Order',
    kicker: 'Logic challenge',
    intro: 'Four symbols hide a four-digit code. Put them in the correct order using the clues.',
    prompt: 'PALM is first. SHELL is immediately after WAVE. SUN is before WAVE. WAVE is not second.',
    answer: '2749',
    placeholder: 'Enter the 4-digit code',
    hint1: 'Start with the clue that gives you an exact position.',
    hint2: 'PALM is first. SUN must come before WAVE.',
    reveal: 'PALM → SUN → WAVE → SHELL. The code is 2749.',
    chips: ['PALM = 2', 'SUN = 7', 'WAVE = 4', 'SHELL = 9'],
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D4: {
    id: 'D4',
    title: 'Search the Area',
    kicker: 'Search code',
    intro: 'Four symbol cards are hidden around this checkpoint. Each card carries one number.',
    prompt: 'Find SUN, PALM, WAVE and STAR. Enter their numbers in the order shown below.',
    answer: '6381',
    placeholder: 'Enter the 4-digit code',
    hint1: 'All four cards are within approximately 20 metres of this QR code.',
    hint2: 'Look high, low and behind fixed objects. The cards are visible without moving hotel property.',
    reveal: 'SUN = 6, PALM = 3, WAVE = 8, STAR = 1. The code is 6381.',
    symbolOrder: ['SUN', 'PALM', 'WAVE', 'STAR'],
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D5: {
    id: 'D5',
    title: 'What Comes Next?',
    kicker: 'Pattern challenge',
    intro: 'One number is missing from the sequence. Your team needs to discover the pattern.',
    prompt: '3  ·  6  ·  11  ·  18  ·  27  ·  ?',
    answer: '38',
    placeholder: 'Enter the missing number',
    hint1: 'Look at the difference between each pair of numbers.',
    hint2: 'The differences are consecutive odd numbers: +3, +5, +7, +9…',
    reveal: 'The next difference is +11, so the answer is 38.',
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
  D1: 'Cipher Challenge',
  D2: 'Observation Challenge',
  D3: 'Logic Order',
  D4: 'Search Code',
  D5: 'Pattern Challenge',
}

export const locationHints: Record<RouteCheckpoint, string> = {
  P1: 'Find the Game Master at Physical Checkpoint P1 - Ball Harvest.',
  P2: 'Find the Game Master at Physical Checkpoint P2 - Water Relay.',
  P3: 'Find the Game Master at Physical Checkpoint P3 - Balloon Transport.',
  P4: 'Find the Game Master at Physical Checkpoint P4 - Team Crane.',
  P5: 'Find Uroš and the mobile physical challenge.',
  D1: 'Find the QR marker for Digital Checkpoint D1 - Cipher Challenge.',
  D2: 'Find the QR marker for Digital Checkpoint D2 - Observation Challenge.',
  D3: 'Find the QR marker for Digital Checkpoint D3 - Logic Order.',
  D4: 'Find the QR marker for Digital Checkpoint D4 - Search Code.',
  D5: 'Find the QR marker for Digital Checkpoint D5 - Pattern Challenge.',
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
