# Arhitektura

## Rendering

- Next.js 16 App Router
- React 19
- TypeScript
- Static export kroz `output: 'export'`
- Sve sadržajne stranice generišu se pri buildu
- Interaktivni djelovi su mali Client Components

## Server Components

Po defaultu su sve `page.tsx`, layout, kartice i sadržajne komponente Server Components. To znači manje JavaScript-a u browseru.

## Client Components

Samo ono što koristi browser state ili eventove:

- `header.tsx` - mobilni meni
- `cookie-banner.tsx` - consent izbor
- `client-runtime.tsx` - pageview i click tracking
- `lead-form.tsx` - kontakt forma
- `blog-explorer.tsx` - filter, search i live feed sync
- `jobs-board.tsx` - angažmani, modal i forme

## Dinamičke rute

- `/usluge/[slug]/`
- `/industrije/[slug]/`
- `/radovi/[slug]/`
- `/blog/[slug]/`
- `/{privatnost|kolacici|uslovi-koriscenja}/`

Sve koriste `generateStaticParams`, pa se pri buildu pretvaraju u statičke HTML stranice.
