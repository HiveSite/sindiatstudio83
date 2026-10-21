'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import styles from './game.module.css'
import { challenges, checkpointLocations, getDigitalSequence, getNextCheckpoint, isCorrectAnswer, normalizeTeamCode, teamRoutes, type CheckpointId } from './game-data'

type SavedResult = { score: number; hints: number; completedAt: string; timedOut?: boolean }
type Progress = Partial<Record<CheckpointId, SavedResult>>

const CHALLENGE_LIMIT_SECONDS = 5 * 60
const STORAGE_VERSION = 'v2'

const ADRIATIC_LOGO_SQUARE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScBst1CPeNSpfj8FUvaFALuW_bSR13CrmehvYUIVoxPYXQkiIbrAnYnRs&s=10'
const ADRIATIC_LOGO_HORIZONTAL = 'https://bankar.me/wp-content/uploads/2023/10/adriatic-bank-660x330-px-2.jpg'

function BrandLogo() {
  return (
    <picture aria-label="Adriatic Bank">
      <source media="(max-width: 480px)" srcSet={ADRIATIC_LOGO_SQUARE} />
      <img
        src={ADRIATIC_LOGO_HORIZONTAL}
        alt="Adriatic Bank"
        style={{ display: 'block', width: 'clamp(124px, 31vw, 182px)', height: '48px', objectFit: 'contain', objectPosition: 'left center' }}
      />
    </picture>
  )
}

function BrandBar({ checkpoint }: { checkpoint?: CheckpointId }) {
  return <div className={styles.brandBar}><div className={styles.brand}><BrandLogo/></div><div className={styles.gameLabel}>Treasure Hunt{checkpoint ? ` · ${checkpoint}` : ''}</div></div>
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function GameClient({ checkpoint }: { checkpoint: CheckpointId }) {
  const challenge = challenges[checkpoint]
  const [teamInput, setTeamInput] = useState('')
  const [teamCode, setTeamCode] = useState('')
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState<SavedResult | null>(null)
  const [startedAt, setStartedAt] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(CHALLENGE_LIMIT_SECONDS)

  const progressKey = teamCode ? `ab-treasure-progress-${STORAGE_VERSION}:${teamCode}` : ''
  const startKey = teamCode ? `ab-treasure-start-${STORAGE_VERSION}:${teamCode}:${checkpoint}` : ''

  const progress = useMemo<Progress>(() => {
    if (!progressKey || typeof window === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem(progressKey) || '{}') } catch { return {} }
  }, [progressKey, completed])

  function saveCompletion(timedOut: boolean) {
    if (!teamCode || completed) return

    const completedAt = new Date().toISOString()
    const result: SavedResult = {
      score: timedOut ? 0 : 100,
      hints: 0,
      completedAt,
      timedOut,
    }

    const previous: Progress = (() => {
      try { return JSON.parse(localStorage.getItem(progressKey) || '{}') } catch { return {} }
    })()

    localStorage.setItem(progressKey, JSON.stringify({ ...previous, [checkpoint]: result }))
    if (startKey) localStorage.removeItem(startKey)
    setCompleted(result)

    const endpoint = process.env.NEXT_PUBLIC_TREASURE_HUNT_ENDPOINT
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamCode,
          checkpoint,
          score: result.score,
          hints: 0,
          timedOut,
          startedAt,
          completedAt,
        }),
      }).catch(() => undefined)
    }
  }

  useEffect(() => {
    if (!teamCode || !startedAt || completed) return

    const tick = () => {
      const started = new Date(startedAt).getTime()
      const elapsed = Math.floor((Date.now() - started) / 1000)
      const remaining = Math.max(0, CHALLENGE_LIMIT_SECONDS - elapsed)
      setSecondsLeft(remaining)
      if (remaining <= 0) saveCompletion(true)
    }

    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [teamCode, startedAt, completed])

  function unlock(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')

    const code = normalizeTeamCode(teamInput)
    if (!teamRoutes[code]) {
      setError('Team code nije pronadjen. Provjerite kod i pokusajte ponovo.')
      return
    }

    const teamProgressKey = `ab-treasure-progress-${STORAGE_VERSION}:${code}`
    let saved: Progress = {}
    try { saved = JSON.parse(localStorage.getItem(teamProgressKey) || '{}') } catch {}

    setTeamCode(code)

    if (saved[checkpoint]) {
      setCompleted(saved[checkpoint]!)
      return
    }

    const teamStartKey = `ab-treasure-start-${STORAGE_VERSION}:${code}:${checkpoint}`
    const existingStart = localStorage.getItem(teamStartKey)
    const start = existingStart || new Date().toISOString()
    if (!existingStart) localStorage.setItem(teamStartKey, start)

    setStartedAt(start)
    const elapsed = Math.floor((Date.now() - new Date(start).getTime()) / 1000)
    setSecondsLeft(Math.max(0, CHALLENGE_LIMIT_SECONDS - elapsed))
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!isCorrectAnswer(checkpoint, answer)) {
      setMessage('Nije tacno. Probajte ponovo.')
      return
    }

    setMessage('')
    saveCompletion(false)
  }

  const next = teamCode ? getNextCheckpoint(teamCode, checkpoint) : null
  const nextLocation = next ? checkpointLocations[next] : null
  const digitalOrder = teamCode ? getDigitalSequence(teamCode) : []
  const completedDigital = teamCode ? digitalOrder.filter(id => progress[id] || (id === checkpoint && completed)).length : 0
  const progressPercent = Math.max(8, (completedDigital / 5) * 100)

  return <div className={styles.shell}><div className={styles.viewport}>
    <BrandBar checkpoint={checkpoint}/>
    <div className={styles.progressWrap}>
      <div className={styles.progressMeta}><span>Digitalni napredak</span><span>{completedDigital}/5</span></div>
      <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${progressPercent}%` }}/></div>
    </div>

    <section className={styles.card}>
      {!teamCode ? <>
        <p className={styles.kicker}>{challenge.kicker}</p>
        <h1 className={styles.title}>Otkljucajte {checkpoint}</h1>
        <p className={styles.intro}>Unesite Team Code vase ekipe. Nakon otkljucavanja imate 5 minuta da rijesite zadatak.</p>
        <form className={styles.form} onSubmit={unlock} style={{ marginTop: 28 }}>
          <label className={styles.label} htmlFor="team">Team Code</label>
          <input id="team" className={styles.input} value={teamInput} onChange={e => setTeamInput(e.target.value)} placeholder="npr. AZUL01" autoCapitalize="characters"/>
          <button type="button" className={styles.button}>OTKLJUCAJ ZADATAK</button>
        </form>
        {error && <div className={styles.errorBox}>{error}</div>}
      </> : completed ? <>
        <div className={styles.successIcon}>✓</div>
        <span className={styles.teamBadge}>{teamCode}</span>
        <p className={styles.kicker} style={{ marginTop: 18 }}>{completed.timedOut ? 'Vrijeme je isteklo' : 'Tacan odgovor'}</p>
        <h1 className={styles.title}>{completed.timedOut ? 'Nastavite dalje.' : 'Tacno!'}</h1>
        <p className={styles.intro}>{completed.timedOut ? 'Proslo je 5 minuta. Sljedeca lokacija je automatski otkljucana.' : 'Zadatak je zavrsen. Sljedeca lokacija je otkljucana.'}</p>

        {next && nextLocation ? <div className={styles.nextBox}>
          <small>SLJEDECA LOKACIJA</small>
          <h2>{nextLocation.display}</h2>
          <p>{nextLocation.instruction}</p>
          {nextLocation.mapsUrl && <a href={nextLocation.mapsUrl} target="_blank" rel="noreferrer" className={styles.button} style={{ display: 'grid', placeItems: 'center', marginTop: 16, textDecoration: 'none', background: 'white', color: '#0f209e' }}>OTVORI LOKACIJU U MAPS</a>}
        </div> : <div className={styles.nextBox}>
          <small>RUTA ZAVRSENA</small>
          <h2>VRATITE SE NA FINALNU LOKACIJU</h2>
          <p>Zavrsili ste svih 10 checkpointova. Vratite se kod organizatora / na finalnu bazu.</p>
        </div>}
      </> : <>
        <span className={styles.teamBadge}>{teamCode}</span>
        <div className={styles.scoreStrip} style={{ marginTop: 18 }}><span>Preostalo vrijeme</span><strong>{formatTime(secondsLeft)}</strong></div>
        <p className={styles.kicker} style={{ marginTop: 18 }}>{challenge.kicker}</p>
        <h1 className={styles.title}>{challenge.title}</h1>
        <p className={styles.intro}>{challenge.intro}</p>

        <div className={styles.challengeBox}>
          <p className={styles.challengePrompt}>{challenge.prompt}</p>
          {challenge.code && <div className={styles.challengeCode}>{challenge.code}</div>}
        </div>

        <form className={styles.form} onSubmit={submit}>
          <label className={styles.label} htmlFor="answer">Vas odgovor</label>
          <input id="answer" className={styles.input} value={answer} onChange={e => setAnswer(e.target.value)} placeholder={challenge.placeholder} autoComplete="off"/>
          <button type="button" className={styles.button}>POTVRDI ODGOVOR</button>
        </form>

        {message && <div className={styles.errorBox}>{message}</div>}
        <p className={styles.note}>Ako zadatak ne rijesite u roku od 5 minuta, sljedeca lokacija ce se otvoriti automatski.</p>
      </>}
    </section>
  </div></div>
}

export function GameHub() {
  return <div className={styles.shell}><div className={styles.viewport}><BrandBar/><section className={styles.card}>
    <p className={styles.kicker}>Organizer preview</p>
    <h1 className={styles.title}>Digitalni checkpointi</h1>
    <p className={styles.intro}>Pet digitalnih zadataka za Adriatic Bank Treasure Hunt. Svaki tim koristi svoj AZUL01-AZUL10 kod. Tacan odgovor odmah otkljucava sljedecu lokaciju; nakon 5 minuta ona se otkljucava automatski.</p>
    <div className={styles.hubGrid}>{(Object.keys(challenges) as CheckpointId[]).map(id => <a className={styles.hubLink} href={`/team-building/azul/${id.toLowerCase()}`} key={id}>{id} · {challenges[id].title}<span>{checkpointLocations[id].display}</span></a>)}</div>
    <p className={styles.note}>D1: 41.9114295, 19.2454535 · D2: 41.9121414, 19.2456818 · D3: 41.9114687, 19.2469180 · D4: 41.9113507, 19.2473455 · D5: 41.9100044, 19.2473746.</p>
  </section></div></div>
}
