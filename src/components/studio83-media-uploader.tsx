'use client'

import { useEffect, useState } from 'react'
import { Studio83MediaControls } from '@/components/studio83-media-controls'
import styles from './studio83-media-uploader.module.css'

type AuthState = 'checking' | 'locked' | 'ready'

export function Studio83MediaUploader() {
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [githubConfigured, setGithubConfigured] = useState(false)

  const checkSession = async () => {
    const response = await fetch('/api/studio83-media', {
      credentials: 'include',
      cache: 'no-store',
    })
    const data = await response.json().catch(() => ({}))
    setGithubConfigured(Boolean(data.githubConfigured))
    setAuthState(response.ok && data.authenticated ? 'ready' : 'locked')
  }

  useEffect(() => {
    checkSession().catch(() => setAuthState('locked'))
  }, [])

  const login = async () => {
    setLoginError('')
    const response = await fetch('/api/studio83-media', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'login', password }),
    })
    const data = await response.json().catch(() => ({}))
    setGithubConfigured(Boolean(data.githubConfigured))
    if (!response.ok) {
      setLoginError(data.error || 'Prijava nije uspjela.')
      return
    }
    setPassword('')
    setAuthState('ready')
  }

  const logout = async () => {
    await fetch('/api/studio83-media', {
      method: 'POST',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).catch(() => undefined)
    setAuthState('locked')
  }

  if (authState === 'checking') {
    return <main className={styles.shell}><div className={styles.centerCard}>Učitavam media admin…</div></main>
  }

  if (authState === 'locked') {
    return (
      <main className={styles.shell}>
        <section className={styles.loginCard}>
          <span className={styles.kicker}>Studio83 / private</span>
          <h1>Media admin</h1>
          <p>Ovdje mijenjaš samo slike za portfolio i case studies. Svaka pozicija će ti pokazati gdje se vidi, kako se cropuje i kako izgleda na desktopu i mobilnom.</p>
          <label>
            <span>Lozinka</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && login()}
              autoComplete="current-password"
            />
          </label>
          {loginError ? <div className={styles.error}>{loginError}</div> : null}
          <button type="button" onClick={login} disabled={!password}>Uđi u media admin</button>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div>
          <span className={styles.kicker}>Studio83 / media admin</span>
          <h1>Ti šteluješ slike.</h1>
          <p>
            Za svaki projekat ispod vidiš <b>tačnu live stranicu</b>, <b>tačan fajl</b>, <b>dimenzije</b>,
            <b> način prikaza</b> i <b>desktop/mobile preview</b>. Prvo provjeri kadar, tek onda sačuvaj.
          </p>
        </div>
        <div className={styles.topActions}>
          <a className={styles.ghostButton} href="/radovi/" target="_blank" rel="noreferrer">Otvori Radove ↗</a>
          <button type="button" className={styles.ghostButton} onClick={logout}>Odjava</button>
        </div>
      </div>

      <section className={styles.howTo}>
        <article>
          <span>1</span>
          <div>
            <strong>Izaberi projekat i poziciju</strong>
            <p>Glavni cover je za kartice i vrh case study-ja. Ostale slike su galerija na detalju projekta.</p>
          </div>
        </article>
        <article>
          <span>2</span>
          <div>
            <strong>Provjeri preview prije čuvanja</strong>
            <p>Za cover obavezno provjeri Desktop i Mobile. Ako je kadar loš, izaberi drugi fajl prije snimanja.</p>
          </div>
        </article>
        <article>
          <span>3</span>
          <div>
            <strong>Čuvaj samo kad izgleda kako želiš</strong>
            <p>Uploader konvertuje u WebP i pravi GitHub commit. Netlify zatim automatski deployuje izmjenu.</p>
          </div>
        </article>
      </section>

      {!githubConfigured ? (
        <div className={styles.warning}>
          <strong>Preview radi, ali čuvanje nije aktivno.</strong>
          <span>Na Netlify projektu nedostaje GitHub write token.</span>
        </div>
      ) : null}

      <Studio83MediaControls />
    </main>
  )
}
