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
    title: 'The Locked Code',
    kicker: 'Checkpoint D1',
    intro: 'A three-digit lock is standing between your team and the next clue. Five failed attempts were left behind.',
    prompt: '682 — one digit is correct and in the right place. 614 — one digit is correct but in the wrong place. 206 — two digits are correct but both are in the wrong places. 738 — none of the digits are correct. 780 — one digit is correct but in the wrong place. What is the code?',
    answer: '042',
    placeholder: 'Enter the 3-digit code',
    hint1: 'Start with the line that tells you which digits cannot appear at all.',
    hint2: '7, 3 and 8 are not in the code. Use that to re-read 682 and 780.',
    reveal: 'The code is 042.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D2: {
    id: 'D2',
    title: 'Three Lives',
    kicker: 'Checkpoint D2',
    intro: 'One word changes its identity twice without changing the order of its remaining letters.',
    prompt: 'I have five letters. Remove my first letter and I become something you can hear in a voice. Remove my first two letters and I become a number. What word am I?',
    answer: 'STONE',
    placeholder: 'Enter the word',
    hint1: 'Work backwards from the number.',
    hint2: 'The number is ONE. Add one letter to its front to make something heard in a voice.',
    reveal: 'STONE → TONE → ONE.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D3: {
    id: 'D3',
    title: 'Five Symbols',
    kicker: 'Checkpoint D3',
    intro: 'Five symbols have been separated from their original order. Each carries one digit.',
    prompt: 'STAR is at one end. PALM stands immediately to the left of SUN. WAVE is somewhere to the right of SUN. SHELL stands immediately to the left of STAR. Restore the order and read the five-digit key.',
    answer: '27495',
    placeholder: 'Enter the 5-digit key',
    hint1: 'The SHELL–STAR pair can only fit at one end once all clues are considered.',
    hint2: 'SHELL and STAR must occupy the final two positions. PALM and SUN must stay together, with WAVE after SUN.',
    reveal: 'PALM → SUN → WAVE → SHELL → STAR. The key is 27495.',
    chips: ['PALM = 2', 'SUN = 7', 'WAVE = 4', 'SHELL = 9', 'STAR = 5'],
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D4: {
    id: 'D4',
    title: 'The Balance',
    kicker: 'Checkpoint D4',
    intro: 'Three symbols are hiding three numbers. The equations are all true.',
    prompt: 'TRIANGLE + TRIANGLE + CIRCLE = 17. CIRCLE + SQUARE = 9. SQUARE = TRIANGLE − 1. Find the value of each symbol, then enter TRIANGLE–CIRCLE–SQUARE as one three-digit code.',
    answer: '736',
    placeholder: 'Enter the 3-digit code',
    hint1: 'Use SQUARE = TRIANGLE − 1 to replace one unknown before solving the other equations.',
    hint2: 'If TRIANGLE is 7, SQUARE must be 6. Check what CIRCLE then has to be.',
    reveal: 'TRIANGLE = 7, CIRCLE = 3, SQUARE = 6. The code is 736.',
    points: { base: 100, hint1: 90, hint2: 75, reveal: 50 },
  },
  D5: {
    id: 'D5',
    title: 'Two Sequences',
    kicker: 'Checkpoint D5',
    intro: 'This line is not one sequence. That is the trap.',
    prompt: '2  ·  9  ·  4  ·  16  ·  6  ·  25  ·  8  ·  ?',
    answer: '36',
    placeholder: 'Enter the missing number',
    hint1: 'Separate the numbers by position: 1st, 3rd, 5th, 7th... and then 2nd, 4th, 6th, 8th...',
    hint2: 'One sequence is 2, 4, 6, 8. The other is 9, 16, 25, ...',
    reveal: 'The second sequence is 3², 4², 5², 6². The missing number is 36.',
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
  D1: 'The Locked Code',
  D2: 'Three Lives',
  D3: 'Five Symbols',
  D4: 'The Balance',
  D5: 'Two Sequences',
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
