import type { Metadata } from 'next'
import { GameHub } from './game-client'

export const metadata: Metadata = {
  title: 'Adriatic Bank Treasure Hunt - Organizer Preview',
  description: 'Organizer preview for the Adriatic Bank digital Treasure Hunt checkpoints.',
  robots: { index: false, follow: false },
}

export default function AzulTreasureHuntPage() {
  return <GameHub />
}
