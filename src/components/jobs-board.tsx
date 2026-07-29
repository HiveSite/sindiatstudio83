'use client'

import { type FormEvent, type MouseEvent, useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'
import { trackEvent } from '@/lib/tracking'

interface Job {
  id?: string
  ID?: string
  title?: string
  position?: string
  company?: string
  location?: string
  pay?: string | number
  type?: string
}

type Status = { type: 'idle' | 'success' | 'error'; text: string }

const fallbackJobs: Job[] = [
  { id: 'open-promoter', title: 'Promoter / promoterka', company: 'Sindikat roster', location: 'Crna Gora', pay: '', type: 'Povremeni angažman' },
  { id: 'open-hostess', title: 'Hostesa / event osoblje', company: 'Sindikat roster', location: 'Crna Gora', pay: '', type: 'Povremeni angažman' },
]

function postUrlEncoded(payload: Record<string, FormDataEntryValue | string>) {
  return fetch(site.integrations.jobsEndpoint, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams({
      ...Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, String(value)])),
      source: 'Sindikat website - Next.js production',
      userAgent: navigator.userAgent,
      pageUrl: window.location.href,
    }).toString(),
  })
}

export function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>(fallbackJobs)
  const [selected, setSelected] = useState<{ id: string; title: string } | null>(null)
  const [applying, setApplying] = useState(false)
  const [posting, setPosting] = useState(false)
  const [applicationStatus, setApplicationStatus] = useState<Status>({ type: 'idle', text: '' })
  const [jobStatus, setJobStatus] = useState<Status>({ type: 'idle', text: '' })
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 10000)
    fetch(`${site.integrations.jobsEndpoint}?action=jobs`, { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json())
      .then((data: Job[] | { jobs?: Job[] }) => {
        const values = Array.isArray(data) ? data : Array.isArray(data.jobs) ? data.jobs : []
        const clean = values.filter((job) => job && (job.title || job.position)).slice(0, 20)
        if (clean.length) setJobs(clean)
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout))
    return () => { controller.abort(); window.clearTimeout(timeout) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    if (selected) window.requestAnimationFrame(() => closeRef.current?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (!selected) return
      if (event.key === 'Escape') {
        setSelected(null)
        window.requestAnimationFrame(() => triggerRef.current?.focus())
        return
      }
      if (event.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        )).filter((element) => !element.hasAttribute('hidden'))
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [selected])

  const openApplication = (id: string, title: string, trigger?: HTMLButtonElement) => {
    if (trigger) triggerRef.current = trigger
    setApplicationStatus({ type: 'idle', text: '' })
    setSelected({ id, title })
    trackEvent('job_apply_start', { job_id: id, job_title: title })
  }

  const closeApplication = () => {
    setSelected(null)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selected || applying) return
    const form = event.currentTarget
    const fd = new FormData(form)
    setApplying(true)
    setApplicationStatus({ type: 'idle', text: 'Slanje u toku...' })
    try {
      await postUrlEncoded({
        action: 'apply',
        jobId: selected.id,
        jobTitle: selected.title,
        name: fd.get('name') || '',
        email: fd.get('email') || '',
        phone: fd.get('phone') || '',
        msg: fd.get('msg') || '',
        submittedAt: new Date().toISOString(),
      })
      trackEvent('job_application', { job_id: selected.id, job_title: selected.title })
      form.reset()
      setApplicationStatus({ type: 'success', text: 'Zahtjev je proslijeđen sistemu za prijave. Ako ne dobiješ povratnu informaciju, piši nam direktno na email.' })
    } catch {
      setApplicationStatus({ type: 'error', text: `Slanje nije pokrenuto. Piši direktno na ${site.email}.` })
      trackEvent('job_application_error', { job_id: selected.id })
    } finally {
      setApplying(false)
    }
  }

  const submitJob = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (posting) return
    const form = event.currentTarget
    const fd = new FormData(form)
    setPosting(true)
    setJobStatus({ type: 'idle', text: 'Slanje u toku...' })
    try {
      await postUrlEncoded({
        action: 'post_job', id: `p_${Date.now()}`, title: fd.get('title') || '', company: fd.get('company') || '',
        location: fd.get('location') || '', category: fd.get('category') || '', type: fd.get('type') || '',
        pay: fd.get('pay') || '', payType: 'daily', posted: new Date().toISOString().slice(0, 10),
        desc: fd.get('desc') || '', responsibilities: '', qualifications: '', benefits: '', img: '', apply: fd.get('apply') || '',
      })
      trackEvent('job_post_submit', { company: fd.get('company') || '' })
      form.reset()
      setJobStatus({ type: 'success', text: 'Zahtjev je proslijeđen na pregled. Objavljivanje nije automatsko.' })
    } catch {
      setJobStatus({ type: 'error', text: `Slanje nije pokrenuto. Piši direktno na ${site.email}.` })
      trackEvent('job_post_error')
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      <section className="section"><div className="container"><div className="section-heading"><div><span className="eyebrow">Aktivni angažmani</span><h2>Prijavi se za konkretnu poziciju ili pošalji otvorenu prijavu.</h2></div><p>Ako veza sa listom angažmana privremeno nije dostupna, prikazuju se otvorene roster prijave.</p></div><div className="jobs-list">
        {jobs.length ? jobs.map((job) => {
          const id = String(job.id || job.ID || 'open')
          const title = String(job.title || job.position || 'Angažman')
          const company = String(job.company || 'Sindikat partner')
          const location = String(job.location || 'Crna Gora')
          const pay = job.pay ? `${job.pay} €` : 'Po dogovoru'
          return <article className="job-card" key={`${id}-${title}`}><div><h3>{title}</h3><p>{company}</p><div className="job-meta"><span>{location}</span><span>{pay}</span><span>{job.type || 'Angažman'}</span></div></div><div className="job-card-actions"><button className="button button-primary button-small" type="button" onClick={(event: MouseEvent<HTMLButtonElement>) => openApplication(id, title, event.currentTarget)}>Prijavi se</button></div></article>
        }) : <p>Trenutno nema objavljenih angažmana. Možeš poslati otvorenu prijavu.</p>}
      </div></div></section>

      <section className="section section-dark"><div className="container dual-list">
        <article className="list-panel"><span className="eyebrow">Za firme</span><h2>Treba ti tim ili želiš objaviti angažman?</h2><p>Za veće recruitment kampanje koristi našu recruitment uslugu ili ImaPosla.me. Za kratke event i promo angažmane možeš poslati zahtjev ispod.</p>
          <form className="lead-form" onSubmit={submitJob} aria-busy={posting}>
            <div className="form-grid">
              <label><span>Naziv pozicije *</span><input name="title" required maxLength={120} placeholder="Promoter / hostesa / event osoblje" /></label>
              <label><span>Kompanija *</span><input name="company" required maxLength={120} /></label>
              <label><span>Lokacija *</span><input name="location" required maxLength={120} placeholder="Podgorica" /></label>
              <label><span>Kategorija</span><select name="category" defaultValue="Promocije"><option>Promocije</option><option>Eventi</option><option>Ugostiteljstvo</option><option>Drugo</option></select></label>
              <label><span>Tip angažmana</span><select name="type" defaultValue="Povremeni"><option>Povremeni</option><option>Sezonski</option><option>Puno radno vrijeme</option></select></label>
              <label><span>Naknada</span><input name="pay" type="number" min="0" placeholder="Iznos u €" /></label>
              <label className="form-span"><span>Opis *</span><textarea name="desc" required maxLength={3000} /></label>
              <label className="form-span"><span>Email ili link za prijavu *</span><input name="apply" required maxLength={300} /></label>
            </div>
            <div className="form-submit"><button className="button button-primary" type="submit" disabled={posting}>{posting ? 'Šaljem...' : 'Pošalji na odobrenje'}</button></div>
            <div className={`form-status${jobStatus.type === 'error' ? ' is-error' : jobStatus.type === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite">{jobStatus.text}</div>
          </form>
        </article>
        <article className="list-panel"><span className="eyebrow">Za kandidate</span><h2>Kako funkcioniše roster.</h2><ul><li>Prijava ulazi u postojeću bazu.</li><li>Kontaktiramo te kada profil i dostupnost odgovaraju projektu.</li><li>Za svaki angažman dobijaš posebne uslove, lokaciju, smjenu i pripremu.</li><li>Nemoj slati osjetljive dokumente kroz ovu osnovnu formu.</li></ul></article>
      </div></section>

      <div className={`modal${selected ? ' is-open' : ''}`} hidden={!selected} onMouseDown={(event: MouseEvent<HTMLDivElement>) => { if (event.currentTarget === event.target) closeApplication() }}>
        <div ref={modalRef} className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="apply-title">
          <div className="modal-header"><div><span className="eyebrow">Prijava</span><h2 id="apply-title">Pošalji podatke</h2></div><button ref={closeRef} className="modal-close" type="button" onClick={closeApplication} aria-label="Zatvori">×</button></div>
          <form className="lead-form" onSubmit={submitApplication} aria-busy={applying}>
            <label><span>Pozicija</span><input name="jobTitle" readOnly value={selected?.title || ''} /></label>
            <div className="form-grid form-grid-spaced">
              <label><span>Ime i prezime *</span><input name="name" required autoComplete="name" maxLength={120} /></label>
              <label><span>Email *</span><input name="email" type="email" required autoComplete="email" maxLength={180} /></label>
              <label><span>Telefon *</span><input name="phone" type="tel" inputMode="tel" required autoComplete="tel" maxLength={40} /></label>
              <label className="form-span"><span>Grad, dostupnost i kratko iskustvo</span><textarea name="msg" rows={4} maxLength={1500} /></label>
            </div>
            <div className="form-submit"><button className="button button-primary" type="submit" disabled={applying}>{applying ? 'Šaljem...' : 'Pošalji prijavu'}</button><p>Prijava se prosljeđuje u postojeći Sindikat sistem.</p></div>
            <div className={`form-status${applicationStatus.type === 'error' ? ' is-error' : applicationStatus.type === 'success' ? ' is-success' : ''}`} role="status" aria-live="polite">{applicationStatus.text}</div>
          </form>
        </div>
      </div>

      <button className="sr-only" type="button" onClick={(event: MouseEvent<HTMLButtonElement>) => openApplication('open-application', 'Otvorena prijava', document.activeElement instanceof HTMLButtonElement ? document.activeElement : event.currentTarget)} data-open-application>Pošalji otvorenu prijavu</button>
    </>
  )
}

export function OpenApplicationButton() {
  const open = () => document.querySelector<HTMLButtonElement>('[data-open-application]')?.click()
  return <button className="button button-primary" type="button" onClick={open}>Pošalji otvorenu prijavu</button>
}
