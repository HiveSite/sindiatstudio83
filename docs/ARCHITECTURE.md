# Arhitektura

## Rendering

- Next.js 16 App Router
- React 19
- TypeScript strict mode
- Static export kroz `output: 'export'`
- Sve sadržajne stranice generišu se pri buildu
- Interaktivni djelovi su izdvojeni u Client Components

## Server Components

Po defaultu su `page.tsx`, layout i sadržajne/presentational komponente Server Components. Tako najveći dio sajta stiže kao statički HTML bez nepotrebnog client JavaScript-a.

Glavni server-side slojevi:

- route stranice u `src/app/`
- `cards.tsx`, `breadcrumbs.tsx`, `section-heading.tsx`, `final-cta.tsx`
- centralni content model u `src/data/`
- metadata i schema helperi u `src/lib/`

## Client Components

Samo funkcionalnosti kojima trebaju browser state, eventovi ili storage:

- `header.tsx` - mobilni meni, aktivna navigacija i language UI
- `cookie-banner.tsx` i `cookie-settings-button.tsx` - consent izbor
- `client-runtime.tsx` - attribution, pageview i click tracking
- `lead-form.tsx` - kontakt/brief forma
- `blog-explorer.tsx` - lokalni filter i pretraga resursa
- `sales-offer.tsx` - category scroller i brief recommender
- `work-filter.tsx` - portfolio filter

## Dinamičke rute

- `/usluge/[slug]/`
- `/industrije/[slug]/`
- `/radovi/[slug]/`
- `/blog/[slug]/`
- `/{privatnost|kolacici|uslovi-koriscenja}/`

Sve koriste statičke parametre i pri buildu postaju HTML stranice.

## Podjela odgovornosti

- `src/data/services.ts` - tekst i struktura usluga
- `src/data/service-products.ts` - jedini source of truth za proizvode i početne cijene
- `src/data/cases.ts` - portfolio/case-study podaci
- `src/data/industries.ts` - industrijski kontekst
- `src/data/blog-posts.json` - produkcijski snapshot blog sadržaja
- `src/data/site.ts` - globalni brand/contact/analytics config
- `netlify.toml` - build, CDN/browser cache i security headers
- `public/_redirects` - canonical i legacy routing

Tok za kandidate i poslove nije dio Studio83 aplikacije; "Postani dio tima" vodi na ImaPosla.me.
