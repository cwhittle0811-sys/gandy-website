import { Link } from 'react-router-dom'
import GandyLogo from './GandyLogo'

export default function Footer() {
  return (
    <footer className="bg-black text-white/40 text-sm py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <GandyLogo />
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
          <a
            href="mailto:info@gandygolf.com"
            className="text-white/50 hover:text-sky-400 transition-colors"
          >
            info@gandygolf.com
          </a>
          <span className="hidden sm:block text-white/20">·</span>
          <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
          <span className="hidden sm:block text-white/20">·</span>
          <span>© {new Date().getFullYear()} Gandy Golf Lessons</span>
        </div>
      </div>
    </footer>
  )
}
