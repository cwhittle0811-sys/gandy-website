export default function GandyLogo({ dark = false, size = 'md' }) {
  const isLg = size === 'lg'
  return (
    <div className="select-none flex flex-col leading-none">
      <span
        className={`font-black uppercase tracking-[0.18em] ${dark ? 'text-gray-900' : 'text-white'} ${isLg ? 'text-2xl' : 'text-[1rem]'}`}
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        Gandy
      </span>
      <span
        className={`font-semibold uppercase tracking-[0.3em] ${dark ? 'text-gray-400' : 'text-white/40'} ${isLg ? 'text-[11px] mt-1' : 'text-[8px] mt-0.5'}`}
      >
        Golf Lessons
      </span>
    </div>
  )
}
