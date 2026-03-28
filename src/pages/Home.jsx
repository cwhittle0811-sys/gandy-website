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
      <section className="px-6 md:px-16 pt-20 pb-24 max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">

          {/* Tag line */}
          <p className="text-sm text-green-700 font-semibold tracking-wide uppercase">
            PGA-Certified Instruction · All Skill Levels
          </p>

          {/* Big headline */}
          <h1
            className="text-gray-900 font-bold leading-[1.0]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
            }}
          >
            Better golf<br />starts here.
          </h1>

          {/* Divider + subtext + CTA on one row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-8 pt-4 border-t border-gray-100">
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

      {/* ─── Credentials strip ─── */}
      <div className="border-t border-b border-gray-100 py-5 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-10 gap-y-2">
          {['PGA Certified Instructor', '5-Star Rated', 'All Skill Levels Welcome', 'Individual & Group', 'Junior Programs Available'].map(item => (
            <span key={item} className="text-xs text-gray-400 font-medium tracking-wide">{item}</span>
          ))}
        </div>
      </div>

      {/* ─── Services ─── */}
      <section className="px-6 md:px-16 py-20 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-xl font-bold text-gray-900">Lesson Options</h2>
          <Link to="/book" className="text-sm text-green-700 hover:text-green-900 transition-colors">Book any →</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
          {[
            { title: 'Individual Lessons', desc: 'Private one-on-one sessions focused on your specific goals and skill level.' },
            { title: 'Group Clinics', desc: 'Small group sessions for 2–6 players. Great for friends and families.' },
            { title: 'Junior Golf', desc: 'Fun, age-appropriate programs that build fundamentals and confidence.' },
            { title: 'Playing Lessons', desc: 'On-course instruction for strategy, shot selection, and course management.' },
          ].map((s) => (
            <Link key={s.title} to="/book" className="group bg-white p-7 hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold text-gray-900 text-sm mb-3 group-hover:text-black">{s.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              <span className="inline-block mt-5 text-xs text-gray-300 group-hover:text-green-600 transition-colors">Book →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── How it works — horizontal ─── */}
      <section className="border-t border-gray-100 px-6 md:px-16 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-12">How to book</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { n: '1', title: 'Create an account', body: 'Sign up with your name and email. Takes 30 seconds.' },
              { n: '2', title: 'Pick a date & time', body: 'Browse the live calendar and choose an open slot.' },
              { n: '3', title: 'Show up & improve', body: 'Tell us your goals. We handle the rest.' },
            ].map(s => (
              <div key={s.n} className="flex gap-5 items-start">
                <span className="text-2xl font-black text-gray-200 leading-none shrink-0 mt-0.5">{s.n}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link
              to="/signup"
              className="inline-block bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-8 py-3 rounded transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="px-6 md:px-16 py-20 max-w-6xl mx-auto text-center">
        <h2
          className="text-gray-900 font-bold mb-4 leading-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Ready to lower your score?
        </h2>
        <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto">
          Check availability and book your first lesson online today.
        </p>
        <Link
          to="/book"
          className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-10 py-3.5 rounded text-sm transition-colors"
        >
          Book a Lesson
        </Link>
      </section>

      <Footer />
    </div>
  )
}
