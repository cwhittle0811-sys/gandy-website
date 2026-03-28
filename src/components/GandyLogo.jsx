// variant: 'full' (mark + wordmark), 'mark' (SVG only), 'wordmark-only'
export default function GandyLogo({ variant = 'full', markSize = 44, dark = false }) {
  const ringColor   = dark ? '#0f172a' : 'white'
  const ringOpacity = dark ? '1'       : '0.25'
  const shaftColor  = dark ? '#0f172a' : 'white'
  const groundColor = dark ? '#0f172a' : 'white'
  const flagColor   = '#38bdf8'

  const Mark = (
    <svg width={markSize} height={markSize} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="46" stroke={ringColor} strokeOpacity={ringOpacity} strokeWidth="2.5" />
      {/* Inner thin ring accent */}
      <circle cx="50" cy="50" r="40" stroke={flagColor} strokeOpacity="0.25" strokeWidth="1" />
      {/* Pin shaft */}
      <line x1="50" y1="76" x2="50" y2="24" stroke={shaftColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Flag */}
      <polygon points="50,24 76,35 50,46" fill={flagColor} />
      {/* Rolling ground */}
      <path d="M16 76 Q50 62 84 76" stroke={groundColor} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Ground dots */}
      <circle cx="28" cy="78" r="2" fill={groundColor} fillOpacity="0.4" />
      <circle cx="72" cy="78" r="2" fill={groundColor} fillOpacity="0.4" />
    </svg>
  )

  if (variant === 'mark') return Mark

  return (
    <div className="flex items-center gap-3 select-none">
      {Mark}
      {variant !== 'mark' && (
        <div className="leading-none">
          <div
            className={`font-bold text-xl tracking-tight leading-none ${dark ? 'text-slate-900' : 'text-white'}`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Gandy
          </div>
          <div className={`text-[10px] font-bold tracking-[0.22em] uppercase mt-1 ${dark ? 'text-sky-500' : 'text-sky-400'}`}>
            Golf Lessons
          </div>
        </div>
      )}
    </div>
  )
}
