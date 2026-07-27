export function SectionHeading({ eyebrow, title, text = '', align = '' }: { eyebrow: string; title: string; text?: string; align?: string }) {
  return (
    <div className={`section-heading${align ? ` section-heading-${align}` : ''}`}>
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      {text ? <p>{text}</p> : null}
    </div>
  )
}
