import type { JsonLdValue } from '@/lib/schema'

export function JsonLd({ data }: { data: JsonLdValue | JsonLdValue[] }) {
  const values = Array.isArray(data) ? data : [data]

  return values.map((value, index) => (
    <script
      key={index}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value).replace(/</g, '\\u003c') }}
    />
  ))
}
