import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'
import GandyLogo from '../components/GandyLogo'

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
    <div className="min-h-screen bg-white text-gray-900">

      {/* ─── Nav ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 md:px-16 h-16 flex items-center justify-between">
        <GandyLogo dark />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Admin</Link>
              )}
              <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">My Lessons</Link>
              <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Log In</Link>
              <Link to="/signup" className="text-sm font-semibold bg-green-700 text-white px-5 py-2 rounded hover:bg-green-800 transition-colors">
                Book a Lesson
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="px-6 md:px-16 pt-24 pb-28 max-w-6xl mx-auto">
        <div className="flex flex-col gap-7">

          {/* Tag line */}
          <div className="hero-anim-1 flex items-center gap-3">
            <span className="accent-line block h-px bg-green-700 shrink-0" />
            <p className="text-xs text-green-700 font-bold tracking-[0.2em] uppercase">
              PGA-Certified Instruction · All Skill Levels
            </p>
          </div>

          {/* Big headline */}
          <h1
            className="hero-anim-2 text-gray-900 font-bold leading-[1.0]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            }}
          >
            Better golf<br />starts here.
          </h1>

          {/* Divider + subtext + CTA on one row */}
          <div className="hero-anim-3 flex flex-col sm:flex-row sm:items-end gap-8 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-base leading-relaxed max-w-xs">
              Expert coaching for beginners through competitive players. Book online — no phone calls needed.
            </p>
            <div className="flex gap-3 sm:ml-auto shrink-0">
              <Link
                to="/book"
                className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-7 py-3 rounded transition-colors"
              >
                Book a Lesson
              </Link>
              <Link
                to="/calendar"
                className="border border-gray-200 hover:border-green-700 hover:text-green-700 text-gray-700 text-sm font-semibold px-7 py-3 rounded transition-colors"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Credentials marquee ─── */}
      <div className="border-t border-b border-gray-100 py-4 overflow-hidden bg-white">
        <div className="marquee-track flex gap-12 w-max">
          {[
            'PGA Certified Instructor', '5-Star Rated', 'All Skill Levels Welcome',
            'Individual & Group', 'Junior Programs Available', 'Online Booking',
            'PGA Certified Instructor', '5-Star Rated', 'All Skill Levels Welcome',
            'Individual & Group', 'Junior Programs Available', 'Online Booking',
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-xs text-gray-400 font-semibold tracking-widest uppercase shrink-0">
              <span className="w-1 h-1 rounded-full bg-green-500 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <section className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <p className="text-xs text-green-700 font-bold tracking-[0.2em] uppercase mb-2">What we offer</p>
            <h2 className="text-2xl font-bold text-gray-900">Lesson Options</h2>
          </div>
          <Link to="/book" className="text-sm text-green-700 hover:text-green-900 transition-colors font-medium">Book any →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {[
            { title: 'Individual Lessons', desc: 'Private one-on-one sessions focused on your specific goals and skill level.', num: '01' },
            { title: 'Group Clinics', desc: 'Small group sessions for 2–6 players. Great for friends and families.', num: '02' },
            { title: 'Junior Golf', desc: 'Fun, age-appropriate programs that build fundamentals and confidence.', num: '03' },
            { title: 'Playing Lessons', desc: 'On-course instruction for strategy, shot selection, and course management.', num: '04' },
          ].map((s) => (
            <Link key={s.title} to="/book" className="group bg-white p-7 hover:bg-gray-50 transition-colors flex flex-col">
              <span className="text-xs font-bold text-gray-200 group-hover:text-green-200 transition-colors mb-4 tracking-widest">{s.num}</span>
              <h3 className="font-semibold text-gray-900 text-sm mb-3 group-hover:text-black leading-snug">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{s.desc}</p>
              <span className="inline-block mt-6 text-xs text-gray-300 group-hover:text-green-600 transition-colors font-semibold">Book →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Testimonial ─── */}
      <section className="bg-green-700 px-6 md:px-16 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-white font-bold leading-snug mb-8"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
            }}
          >
            "My handicap dropped 8 strokes in one season.<br className="hidden md:block" />
            Best investment I've made in my game."
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-px bg-white/40" />
            <p className="text-white/60 text-sm font-semibold tracking-wide uppercase">Marcus T. — Member since 2023</p>
            <span className="w-8 h-px bg-white/40" />
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="px-6 md:px-16 py-24 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-16">
          <div>
            <p className="text-xs text-green-700 font-bold tracking-[0.2em] uppercase mb-2">Simple process</p>
            <h2 className="text-2xl font-bold text-gray-900">How to book</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { n: '01', title: 'Create an account', body: 'Sign up with your name and email. Takes 30 seconds.' },
            { n: '02', title: 'Pick a date & time', body: 'Browse the live calendar and choose an open slot.' },
            { n: '03', title: 'Show up & improve', body: 'Tell us your goals. We handle the rest.' },
          ].map(s => (
            <div key={s.n} className="relative">
              <div
                className="font-black leading-none text-gray-900/[0.04] select-none mb-4"
                style={{ fontSize: '7rem', fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {s.n}
              </div>
              <p className="font-bold text-gray-900 mb-2">{s.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14">
          <Link
            to="/signup"
            className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-8 py-3 rounded transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-gray-900 px-6 md:px-16 py-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-xs text-green-400 font-bold tracking-[0.2em] uppercase mb-3">Ready to improve?</p>
            <h2
              className="text-white font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
            >
              Lower your score.<br />Book today.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/book"
              className="bg-green-700 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded text-sm transition-colors text-center"
            >
              Book a Lesson
            </Link>
            <Link
              to="/calendar"
              className="border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-semibold px-10 py-4 rounded text-sm transition-colors text-center"
            >
              View Schedule
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
