import GandyLogo from '../components/GandyLogo'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format, parseISO, isPast, startOfDay } from 'date-fns'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate('/login'); return }
      setUser(session.user)
      fetchBookings(session.user.id)
    })
  }, [])

  async function fetchBookings(userId) {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  async function handleCancel(id) {
    if (!confirm('Cancel this lesson?')) return
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const upcoming = bookings.filter(b => !isPast(startOfDay(parseISO(b.date))) || b.date === format(new Date(), 'yyyy-MM-dd'))
  const past = bookings.filter(b => isPast(startOfDay(parseISO(b.date))) && b.date !== format(new Date(), 'yyyy-MM-dd'))

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-black px-6 py-4 flex items-center justify-between shadow-lg">
        <Link to="/"><GandyLogo markSize={32} /></Link>
        <div className="flex items-center gap-4">
          <span className="text-white/60 text-sm hidden sm:block">{user?.email}</span>
          <button onClick={handleSignOut} className="text-white/70 hover:text-white text-sm transition-colors">
            Sign Out
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sky-500 font-semibold uppercase tracking-widest text-sm mb-1">My Account</p>
            <h1 className="text-2xl font-bold text-gray-900">My Lessons</h1>
          </div>
          <Link
            to="/book"
            className="bg-white hover:bg-sky-50 text-sky-500 font-bold px-5 py-2.5 rounded-full text-sm transition-all shadow"
          >
            + Book Lesson
          </Link>
        </div>

        {/* Upcoming */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Upcoming</h2>
          {upcoming.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-400">
              <p className="text-3xl mb-3">⛳</p>
              <p className="font-medium">No upcoming lessons</p>
              <Link to="/book" className="text-sky-500 text-sm font-semibold mt-2 inline-block hover:text-sky-600">
                Book your first lesson →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcoming.map(booking => (
                <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} isPast={false} />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Past Lessons</h2>
            <div className="flex flex-col gap-4">
              {past.map(booking => (
                <BookingCard key={booking.id} booking={booking} onCancel={null} isPast={true} />
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  )
}

function BookingCard({ booking, onCancel, isPast }) {
  const date = parseISO(booking.date)

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${isPast ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:shadow-md'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4 items-start">
          <div className="bg-sky-500 text-white rounded-xl px-3 py-2 text-center min-w-[52px] shrink-0">
            <div className="text-xs font-semibold opacity-70 uppercase">{format(date, 'MMM')}</div>
            <div className="text-2xl font-bold leading-none">{format(date, 'd')}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-gray-900">{booking.time_slot}</span>
              {!isPast && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Upcoming
                </span>
              )}
              {isPast && (
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  Completed
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">⛳ {booking.address}</p>
            <p className="text-sm text-gray-400 leading-relaxed">{booking.description}</p>
          </div>
        </div>

        {onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="text-red-400 hover:text-red-600 text-xs font-medium shrink-0 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
