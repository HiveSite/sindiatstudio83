import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { GameClient } from '../game-client'
import { challenges, type CheckpointId } from '../game-data'

export const metadata: Metadata = {
  title: 'Adriatic Bank Treasure Hunt',
  description: 'Digital checkpoint for the Adriatic Bank team-building Treasure Hunt.',
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return Object.keys(challenges).map(checkpoint => ({ checkpoint: checkpoint.toLowerCase() }))
}

export default async function CheckpointPage({ params }: { params: Promise<{ checkpoint: string }> }) {
  const { checkpoint } = await params
  const id = checkpoint.toUpperCase() as CheckpointId
  if (!challenges[id]) notFound()
  return <GameClient checkpoint={id} />
}
