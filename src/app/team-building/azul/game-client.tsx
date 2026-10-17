'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import styles from './game.module.css'
import { challenges, checkpointLocations, getDigitalSequence, getNextCheckpoint, normalizeAnswer, normalizeTeamCode, teamRoutes, type CheckpointId } from './game-data'

type SavedResult = { score: number; hints: number; completedAt: string }
type Progress = Partial<Record<CheckpointId, SavedResult>>

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

export function GameClient({ checkpoint }: { checkpoint: CheckpointId }) {
  const challenge = challenges[checkpoint]
  const [teamInput, setTeamInput] = useState('')
  const [teamCode, setTeamCode] = useState('')
  const [answer, setAnswer] = useState('')
  const [hints, setHints] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState<SavedResult | null>(null)
  const [startedAt, setStartedAt] = useState('')

  const progressKey = teamCode ? `ab-treasure-progress:${teamCode}` : ''
  const progress = useMemo<Progress>(() => {
    if (!progressKey || typeof window === 'undefined') return {}
    try { return JSON.parse(localStorage.getItem(progressKey) || '{}') } catch { return {} }
  }, [progressKey, completed])

  useEffect(() => {
    if (teamCode && !startedAt) setStartedAt(new Date().toISOString())
  }, [teamCode, startedAt])

  const score = hints === 0 ? challenge.points.base : hints === 1 ? challenge.points.hint1 : hints === 2 ? challenge.points.hint2 : challenge.points.reveal

  function unlock(e: FormEvent) {
    e.preventDefault(); setError(''); setMessage('')
    const code = normalizeTeamCode(teamInput)
    if (!teamRoutes[code]) { setError('Team code not found. Check your team card and try again.'); return }
    let saved: Progress = {}
    try { saved = JSON.parse(localStorage.getItem(`ab-treasure-progress:${code}`) || '{}') } catch {}
    if (saved[checkpoint]) { setTeamCode(code); setCompleted(saved[checkpoint]!); return }
    setTeamCode(code)
    setStartedAt(new Date().toISOString())
  }

  function useHint(level: number) {
    if (level !== hints + 1 || level > 3) return
    setHints(level)
    setMessage('')
  }

  async function submit(e: FormEvent) {
    e.preventDefault(); setError('')
    if (normalizeAnswer(answer) !== normalizeAnswer(challenge.answer)) { setMessage('Not quite. Try again.'); return }
    const result: SavedResult = { score, hints, completedAt: new Date().toISOString() }
    const previous: Progress = (() => { try { return JSON.parse(localStorage.getItem(progressKey) || '{}') } catch { return {} } })()
    localStorage.setItem(progressKey, JSON.stringify({ ...previous, [checkpoint]: result }))
    setCompleted(result)
    const endpoint = process.env.NEXT_PUBLIC_TREASURE_HUNT_ENDPOINT
    if (endpoint) {
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamCode, checkpoint, score, hints, startedAt, completedAt: result.completedAt }) }).catch(() => undefined)
    }
  }

  const next = teamCode ? getNextCheckpoint(teamCode, checkpoint) : null
  const nextLocation = next ? checkpointLocations[next] : null
  const digitalOrder = teamCode ? getDigitalSequence(teamCode) : []
  const completedDigital = teamCode ? digitalOrder.filter(id => progress[id] || id === checkpoint && completed).length : 0
  const progressPercent = Math.max(8, (completedDigital / 5) * 100)

  return <div className={styles.shell}><div className={styles.viewport}>
    <BrandBar checkpoint={checkpoint}/>
    <div className={styles.progressWrap}><div className={styles.progressMeta}><span>Digital progress</span><span>{completedDigital}/5</span></div><div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${progressPercent}%` }}/></div></div>
    <section className={styles.card}>
      {!teamCode ? <>
        <p className={styles.kicker}>{challenge.kicker}</p><h1 className={styles.title}>Unlock {checkpoint}</h1><p className={styles.intro}>Enter the Team Code from your team card to unlock this challenge.</p>
        <form className={styles.form} onSubmit={unlock} style={{ marginTop: 28 }}><label className={styles.label} htmlFor="team">Team code</label><input id="team" className={styles.input} value={teamInput} onChange={e => setTeamInput(e.target.value)} placeholder="e.g. AZUL01" autoCapitalize="characters"/><button className={styles.button}>UNLOCK CHALLENGE</button></form>
        {error && <div className={styles.errorBox}>{error}</div>}
      </> : completed ? <>
        <div className={styles.successIcon}>✓</div><span className={styles.teamBadge}>{teamCode}</span><p className={styles.kicker} style={{ marginTop: 18 }}>Challenge complete</p><h1 className={styles.title}>Nice work.</h1><div className={styles.scoreBig}>{completed.score}</div><p className={styles.intro}>POINTS EARNED</p>
        {next && nextLocation ? <div className={styles.nextBox}><small>Your next location</small><h2>{nextLocation.display}</h2><p>{nextLocation.instruction}</p>{nextLocation.mapsUrl && <a href={nextLocation.mapsUrl} target="_blank" rel="noreferrer" className={styles.button} style={{ display: 'grid', placeItems: 'center', marginTop: 16, textDecoration: 'none', background: 'white', color: '#0f209e' }}>OPEN LOCATION IN MAPS</a>}</div> : <div className={styles.nextBox}><small>Route complete</small><h2>RETURN TO FINAL BASE</h2><p>Your team has completed all 10 checkpoints. Return to the event host / final base.</p></div>}
      </> : <>
        <span className={styles.teamBadge}>{teamCode}</span><p className={styles.kicker} style={{ marginTop: 18 }}>{challenge.kicker}</p><h1 className={styles.title}>{challenge.title}</h1><p className={styles.intro}>{challenge.intro}</p>
        <div className={styles.challengeBox}><p className={styles.challengePrompt}>{challenge.prompt}</p>{challenge.code && <div className={styles.challengeCode}>{challenge.code}</div>}{challenge.chips && <div className={styles.chips}>{challenge.chips.map(x => <span className={styles.chip} key={x}>{x}</span>)}</div>}{challenge.symbolOrder && <div className={styles.symbolOrder}>{challenge.symbolOrder.map(x => <div className={styles.symbol} key={x}>{x}</div>)}</div>}</div>
        <form className={styles.form} onSubmit={submit}><label className={styles.label} htmlFor="answer">Your answer</label><input id="answer" className={styles.input} value={answer} onChange={e => setAnswer(e.target.value)} placeholder={challenge.placeholder} autoComplete="off"/><button className={styles.button}>SUBMIT ANSWER</button></form>

        {hints >= 1 && <div className={styles.hintBox}><strong>Hint 1</strong><br/>{challenge.hint1}</div>}
        {hints >= 2 && <div className={styles.hintBox}><strong>Hint 2</strong><br/>{challenge.hint2}</div>}
        {hints >= 3 && <div className={styles.hintBox}><strong>Reveal</strong><br/>{challenge.reveal}</div>}

        <div className={styles.hintGrid} style={{ gridTemplateColumns: '1fr' }}>
          {hints === 0 && <button className={styles.hintButton} onClick={() => useHint(1)}>OPEN HINT 1 · MAX 90 PTS</button>}
          {hints === 1 && <button className={styles.hintButton} onClick={() => useHint(2)}>OPEN HINT 2 · MAX 75 PTS</button>}
          {hints === 2 && <button className={styles.hintButton} onClick={() => useHint(3)}>REVEAL ANSWER · 50 PTS</button>}
        </div>

        {message && <div className={styles.errorBox}>{message}</div>}
        <div className={styles.scoreStrip}><span>Current maximum</span><strong>{score} pts</strong></div>
      </>}
    </section>
  </div></div>
}

export function GameHub() {
  return <div className={styles.shell}><div className={styles.viewport}><BrandBar/><section className={styles.card}><p className={styles.kicker}>Organizer preview</p><h1 className={styles.title}>Digital Checkpoints</h1><p className={styles.intro}>Five mobile game pages for the Adriatic Bank Treasure Hunt at Azul. Team codes AZUL01–AZUL10 use separate randomized routes. After each solved digital challenge, the page shows that team’s exact next location.</p><div className={styles.hubGrid}>{(Object.keys(challenges) as CheckpointId[]).map(id => <a className={styles.hubLink} href={`/team-building/azul/${id.toLowerCase()}`} key={id}>{id} · {challenges[id].title}<span>{checkpointLocations[id].display}</span></a>)}</div><p className={styles.note}>D1: 41.9114295, 19.2454535 · D2: 41.9121414, 19.2456818 · D3: 41.9114687, 19.2469180 · D4: 41.9113507, 19.2473455 · D5: 41.9100044, 19.2473746.</p></section></div></div>
}
