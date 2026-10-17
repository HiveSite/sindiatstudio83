export type CheckpointId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5'
export type RouteCheckpoint = CheckpointId | 'P1' | 'P2' | 'P3' | 'P4' | 'P5'

export type DigitalChallenge = {
  id: CheckpointId
  title: string
  kicker: string
  intro: string
  prompt: string
  answer: string
  acceptedAnswers?: string[]
  placeholder: string
  code?: string
}

export type CheckpointLocation = {
  display: string
  instruction: string
  mapsUrl?: string
}

export const challenges: Record<CheckpointId, DigitalChallenge> = {
  D1: {
    id: 'D1',
    title: 'Nemoguci zadatak',
    kicker: 'Digitalni checkpoint D1',
    intro: 'Ovo izgleda mnogo gore nego sto zaista jeste. Imate najvise pet minuta.',
    prompt: 'Bez kalkulatora, interneta i konsultacija sa profesorom matematike: koliko tacno iznosi ovaj izraz?',
    code: '∫₀^π [(sin⁸x + cos⁸x) / (1 + sin²x·cos²x)] dx  +  Σₖ₌₁⁹⁹ (-1)ᵏ/k',
    answer: 'NE ZNAM',
    acceptedAnswers: ['NE ZNAM', 'NEZNAM', 'NEMAM POJMA'],
    placeholder: 'Upisite odgovor',
  },
  D2: {
    id: 'D2',
    title: 'Porodicna logika',
    kicker: 'Digitalni checkpoint D2',
    intro: 'Procitajte pazljivo. Odgovor je jednostavniji nego sto djeluje.',
    prompt: 'Jedan covjek kaze: "Nemam ni brata ni sestru, ali otac ovog djecaka je sin mog oca." Ko je taj djecak tom covjeku?',
    answer: 'NJEGOV SIN',
    acceptedAnswers: ['NJEGOV SIN', 'SIN', 'NJEGOVO DIJETE', 'DIJETE'],
    placeholder: 'Upisite odgovor',
  },
  D3: {
    id: 'D3',
    title: 'Uljez',
    kicker: 'Digitalni checkpoint D3',
    intro: 'Cetiri pojma pripadaju istoj prici. Jedan se tu nasao bez poziva.',
    prompt: 'KARTICA · PIN · RACUN · KREDIT · TALAS — koja rijec ne pripada grupi?',
    answer: 'TALAS',
    acceptedAnswers: ['TALAS'],
    placeholder: 'Upisite rijec',
  },
  D4: {
    id: 'D4',
    title: 'Hotelska soba',
    kicker: 'Digitalni checkpoint D4',
    intro: 'Tri gosta, tri sobe i samo jedno moguce rjesenje.',
    prompt: 'Ana, Marko i Ivan su u sobama 201, 305 i 408. Ana nije na drugom spratu. Marko je na visem spratu od Ane. Ivan nije u sobi 408. Ko je u sobi 408?',
    answer: 'MARKO',
    acceptedAnswers: ['MARKO'],
    placeholder: 'Upisite ime',
  },
  D5: {
    id: 'D5',
    title: 'Ne komplikujte',
    kicker: 'Digitalni checkpoint D5',
    intro: 'Najbrzi timovi ovdje obicno prvo previse razmisljaju.',
    prompt: 'Sta mozete drzati u desnoj ruci, ali nikada u lijevoj?',
    answer: 'LIJEVU RUKU',
    acceptedAnswers: ['LIJEVU RUKU', 'LEVU RUKU', 'LIJEVA RUKA', 'LEVA RUKA'],
    placeholder: 'Upisite odgovor',
  },
}

export const teamRoutes: Record<string, RouteCheckpoint[]> = {
  AZUL01: ['P2', 'D2', 'D5', 'P4', 'P5', 'D3', 'D1', 'P3', 'P1', 'D4'],
  AZUL02: ['D4', 'P1', 'P3', 'D1', 'D3', 'P5', 'P4', 'D5', 'D2', 'P2'],
  AZUL03: ['P4', 'D3', 'D2', 'P3', 'P2', 'D4', 'D5', 'P1', 'P5', 'D1'],
  AZUL04: ['D1', 'P5', 'P1', 'D5', 'D4', 'P2', 'P3', 'D2', 'D3', 'P4'],
  AZUL05: ['P3', 'D4', 'D3', 'P1', 'P4', 'D1', 'D2', 'P5', 'P2', 'D5'],
  AZUL06: ['D3', 'P3', 'P4', 'D4', 'D2', 'P1', 'P2', 'D1', 'D5', 'P5'],
  AZUL07: ['P5', 'D5', 'D1', 'P2', 'P1', 'D2', 'D4', 'P4', 'P3', 'D3'],
  AZUL08: ['D2', 'P4', 'P2', 'D3', 'D5', 'P3', 'P5', 'D4', 'D1', 'P1'],
  AZUL09: ['P1', 'D1', 'D4', 'P5', 'P3', 'D5', 'D3', 'P2', 'P4', 'D2'],
  AZUL10: ['D5', 'P2', 'P5', 'D2', 'D1', 'P4', 'P1', 'D3', 'D4', 'P3'],
}

export const checkpointLocations: Record<RouteCheckpoint, CheckpointLocation> = {
  P1: {
    display: '41.9086887, 19.2442599',
    instruction: 'Idite na ove koordinate i pronadjite fizicki checkpoint.',
    mapsUrl: 'https://www.google.com/maps?q=41.9086887,19.2442599',
  },
  P2: {
    display: '41.9083408, 19.2463678',
    instruction: 'Idite na ove koordinate i pronadjite fizicki checkpoint.',
    mapsUrl: 'https://www.google.com/maps?q=41.9083408,19.2463678',
  },
  P3: {
    display: '41.9094981, 19.2465703',
    instruction: 'Idite na ove koordinate i pronadjite fizicki checkpoint.',
    mapsUrl: 'https://www.google.com/maps?q=41.9094981,19.2465703',
  },
  P4: {
    display: '41.9127689, 19.2461371',
    instruction: 'Idite na ove koordinate i pronadjite fizicki checkpoint.',
    mapsUrl: 'https://www.google.com/maps?q=41.9127689,19.2461371',
  },
  P5: {
    display: 'PRONADJITE UROSA - MOBILE CHECKPOINT',
    instruction: 'Pronadjite Urosa i zavrsite mobilni fizicki izazov.',
  },
  D1: {
    display: '41.9114295, 19.2454535',
    instruction: 'Idite na ove koordinate i pronadjite QR marker.',
    mapsUrl: 'https://www.google.com/maps?q=41.9114295,19.2454535',
  },
  D2: {
    display: '41.9121414, 19.2456818',
    instruction: 'Idite na ove koordinate i pronadjite QR marker.',
    mapsUrl: 'https://www.google.com/maps?q=41.9121414,19.2456818',
  },
  D3: {
    display: '41.9114687, 19.2469180',
    instruction: 'Idite na ove koordinate i pronadjite QR marker.',
    mapsUrl: 'https://www.google.com/maps?q=41.9114687,19.2469180',
  },
  D4: {
    display: '41.9113507, 19.2473455',
    instruction: 'Idite na ove koordinate i pronadjite QR marker.',
    mapsUrl: 'https://www.google.com/maps?q=41.9113507,19.2473455',
  },
  D5: {
    display: '41.9100044, 19.2473746',
    instruction: 'Idite na ove koordinate i pronadjite QR marker.',
    mapsUrl: 'https://www.google.com/maps?q=41.9100044,19.2473746',
  },
}

export function normalizeTeamCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, '')
}

export function normalizeAnswer(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[ČĆ]/g, 'C')
    .replace(/Š/g, 'S')
    .replace(/Ž/g, 'Z')
    .replace(/Đ/g, 'DJ')
    .replace(/\s+/g, ' ')
}

export function isCorrectAnswer(checkpoint: CheckpointId, value: string) {
  const challenge = challenges[checkpoint]
  const accepted = challenge.acceptedAnswers?.length ? challenge.acceptedAnswers : [challenge.answer]
  const normalized = normalizeAnswer(value)
  return accepted.some(item => normalizeAnswer(item) === normalized)
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
