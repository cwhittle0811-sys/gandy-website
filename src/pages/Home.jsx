import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import GandyLogo from '../components/GandyLogo'

const TRUST_ITEMS = [
  'PGA Certified Instructor',
  'All Skill Levels Welcome',
  'Easy Online Booking',
  'Personalized Coaching',
  '5-Star Rated',
  'Junior Programs',
  'PGA Certified Instructor',
  'All Skill Levels Welcome',
  'Easy Online Booking',
  'Personalized Coaching',
  '5-Star Rated',
  'Junior Programs',
]

const SERVICES = [
  {
    num: '01',
    title: 'Individual Lessons',
    desc: 'One-on-one coaching tailored to your swing, goals, and skill level. The fastest way to improve.',
  },
  {
    num: '02',
    title: 'Group Clinics',
    desc: 'Fun, affordable group sessions covering fundamentals for 2–6 players. Great for friends or families.',
  },
  {
    num: '03',
    title: 'Junior Golf',
    desc: 'Age-appropriate programs to build confidence and a lifelong love of the game.',
  },
  {
    num: '04',
    title: 'On-Course Playing Lessons',
    desc: 'Take your range game to the course with real-round instruction and strategy.',
  },
]

export default function Home() {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.app_metadata?.role === 'admin')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      setIsAdmin(session?.user?.app_metadata?.role === 'admin')
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ─── Navbar ─── */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
        <GandyLogo />
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                My Lessons
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-sky-500 hover:bg-sky-400 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all shadow-lg shadow-sky-500/30"
              >
                Book a Lesson
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #0ea5e9, transparent)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

          {/* Logo mark — large */}
          <div className="hero-anim-1 mb-8">
            <GandyLogo variant="mark" markSize={90} />
          </div>

          {/* Eyebrow */}
          <p className="hero-anim-2 text-sky-400 text-xs font-bold tracking-[0.35em] uppercase mb-5">
            PGA-Certified Golf Instruction
          </p>

          {/* Headline */}
          <h1 className="hero-anim-3 text-white font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontFamily: "'Playfair Display', Georgia, serif" }}>
            Elevate Your<br />
            <span className="text-sky-300">Golf Game</span>
          </h1>

          {/* Sub */}
          <p className="hero-anim-4 text-white/50 text-lg max-w-md mb-10 leading-relaxed">
            Expert lessons for all ages and skill levels.
            Book online in seconds — no phone calls needed.
          </p>

          {/* CTAs */}
          <div className="hero-anim-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/book"
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl shadow-sky-500/30"
            >
              Book a Lesson
            </Link>
            <Link
              to="/calendar"
              className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold px-10 py-4 rounded-full text-lg border border-white/15 transition-all hover:scale-105"
            >
              View Availability
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-white animate-pulse" />
          <span className="text-white text-[10px] tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ─── Trust Marquee ─── */}
      <div className="bg-[#0a0a0a] border-y border-white/5 py-4 overflow-hidden">
        <div className="marquee-track flex gap-12 whitespace-nowrap w-max">
          {TRUST_ITEMS.map((item, i) => (
            <span key={i} className="text-white/30 text-[11px] font-bold tracking-[0.2em] uppercase flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-sky-500 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-px bg-sky-400" />
            <p className="text-sky-500 text-xs font-bold tracking-[0.25em] uppercase">What We Offer</p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 leading-tight max-w-sm"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Lesson<br />Options
          </h2>

          <div className="divide-y divide-gray-100">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="flex items-start gap-8 py-10 group cursor-default"
              >
                <span className="text-gray-100 font-bold text-5xl leading-none shrink-0 w-14 text-right tabular-nums group-hover:text-sky-100 transition-colors duration-300">
                  {s.num}
                </span>
                <div className="flex-1">
                  <h3 className="text-gray-900 font-bold text-xl mb-2 group-hover:text-sky-600 transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-lg">
                    {s.desc}
                  </p>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 transition-all duration-300">
                  <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              to="/book"
              className="inline-flex items-center gap-3 bg-black hover:bg-gray-900 text-white font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              Book Any Lesson
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24 px-6 md:px-12 bg-slate-50">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-4 mb-16">
            <div className="w-8 h-px bg-sky-400" />
            <p className="text-sky-500 text-xs font-bold tracking-[0.25em] uppercase">Simple Process</p>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 max-w-xs leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            How to<br />Book
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up in seconds — just your name and email.' },
              { step: '02', title: 'Pick a Date & Time', desc: 'Check the live calendar and choose an open slot that works for you.' },
              { step: '03', title: 'Show Up & Improve', desc: "Tell us your goals and experience. We'll take it from there." },
            ].map((s, i) => (
              <div key={i} className="flex flex-col gap-5">
                <div className="w-12 h-12 rounded-2xl bg-black text-sky-400 font-bold text-sm flex items-center justify-center">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative bg-black py-28 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #0ea5e9, transparent)' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-sky-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">Get Started</p>
          <h2 className="text-white text-4xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Ready to Lower<br />Your Score?
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Check availability and book your first golf lesson online — no phone calls needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl shadow-sky-500/30"
            >
              Book Now
            </Link>
            <Link
              to="/calendar"
              className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-semibold px-10 py-4 rounded-full text-lg border border-white/15 transition-all hover:scale-105"
            >
              View Calendar
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
