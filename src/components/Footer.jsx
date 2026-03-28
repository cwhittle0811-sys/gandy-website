import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white/50 text-sm py-8 px-6 text-center">
      <p className="text-white/70 mb-1">
        Questions? Email us at{' '}
        <a
          href="mailto:info@gandygolf.com"
          className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
        >
          info@gandygolf.com
        </a>
      </p>
      <p className="mb-3">© {new Date().getFullYear()} Gandy Golf Lessons</p>
      <div className="flex justify-center gap-4">
        <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
      </div>
    </footer>
  )
}
