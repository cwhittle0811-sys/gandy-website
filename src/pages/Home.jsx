import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

const TRUST_ITEMS = [
  '⛳ PGA Certified Instructor',
  '🏌️ All Skill Levels Welcome',
  '📅 Easy Online Booking',
  '🎯 Personalized Coaching',
  '⭐ 5-Star Rated',
  '👶 Junior Programs',
  '⛳ PGA Certified Instructor',
  '🏌️ All Skill Levels Welcome',
  '📅 Easy Online Booking',
  '🎯 Personalized Coaching',
  '⭐ 5-Star Rated',
  '👶 Junior Programs',
]

const SERVICES = [
  {
    icon: '🏌️',
    title: 'Individual Lessons',
    desc: 'One-on-one coaching tailored to your swing, goals, and skill level.',
  },
  {
    icon: '👥',
    title: 'Group Clinics',
    desc: 'Fun, affordable group sessions covering fundamentals for 2–6 players.',
  },
  {
    icon: '👶',
    title: 'Junior Golf',
    desc: 'Age-appropriate programs to build confidence and a lifelong love of the game.',
  },
  {
    icon: '⛳',
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
      <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-xl drop-shadow-lg tracking-tight">Gandy Golf</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-white/90 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                  Admin
                </Link>
              )}
              <Link to="/dashboard" className="text-white/90 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                My Lessons
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-white hover:bg-sky-50 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white/90 hover:text-white text-sm font-medium transition-colors px-4 py-2">
                Log In
              </Link>
              <Link to="/signup" className="bg-white hover:bg-sky-50 text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-lg">
                Book a Lesson
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-black">
        {/* Hero background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(https://cdn.phototourl.com/free/2026-03-28-3b9fa222-1c20-4571-a844-9b73373b696e.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 40%',
            backgroundColor: 'black',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
          {/* Gold accent line */}
          <div className="hero-anim-1 flex justify-center mb-6">
            <div className="accent-line h-[3px] bg-white rounded-full" />
          </div>

          <h1 className="hero-anim-2 text-white text-4xl md:text-6xl font-bold leading-tight mb-4 drop-shadow-lg">
            Elevate Your Game With<br />
            <span className="text-sky-300">Expert Golf Lessons</span>
          </h1>

          <p className="hero-anim-3 text-white/80 text-lg md:text-xl max-w-xl mb-8 leading-relaxed">
            PGA-certified instruction for all ages and skill levels.
            Book your lesson online in seconds — we'll handle the rest.
          </p>

          <div className="hero-anim-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book"
              className="bg-white hover:bg-sky-50 text-gray-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
            >
              Book a Lesson
            </Link>
            <Link
              to="/calendar"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/30 transition-all hover:scale-105"
            >
              View Availability
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Trust Marquee ─── */}
      <div className="bg-[#1d4ed8] py-3 overflow-hidden">
        <div className="marquee-track flex gap-10 whitespace-nowrap w-max">
          {TRUST_ITEMS.map((item, i) => (
            <span key={i} className="text-sky-300 text-sm font-semibold tracking-wider uppercase px-4">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sky-500 font-semibold uppercase tracking-widest text-sm mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Lesson Options</h2>
            <div className="w-16 h-1 bg-white mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="group bg-slate-50 hover:bg-[#1d4ed8] rounded-2xl p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default"
              >
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-bold text-gray-900 group-hover:text-white text-lg mb-2 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sky-500 font-semibold uppercase tracking-widest text-sm mb-3">Simple Process</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How to Book</h2>
          <div className="w-16 h-1 bg-white mx-auto rounded-full mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create an Account', desc: 'Sign up in seconds — just your name and email.' },
              { step: '02', title: 'Pick a Date & Time', desc: 'Check the live calendar and choose an open slot that works for you.' },
              { step: '03', title: 'Show Up & Improve', desc: 'Tell us your goals and experience. We\'ll take it from there.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#1d4ed8] text-sky-300 font-bold text-lg flex items-center justify-center shadow-lg">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-[#1d4ed8] py-16 px-6 text-center">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
          Ready to Lower Your Score?
        </h2>
        <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
          Check availability and book your first golf lesson online — no phone calls needed.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/book"
            className="bg-white hover:bg-sky-50 text-gray-900 font-bold px-8 py-4 rounded-full text-lg shadow-xl transition-all hover:scale-105"
          >
            Book Now
          </Link>
          <Link
            to="/calendar"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg border border-white/30 transition-all hover:scale-105"
          >
            View Calendar
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
