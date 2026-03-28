import GandyLogo from '../components/GandyLogo'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format, parseISO, startOfWeek, addDays } from 'date-fns'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [view, setView] = useState('day')
  const [search, setSearch] = useState('')

  const [blockedDates, setBlockedDates] = useState([])
  const [blockDate, setBlockDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [blockMode, setBlockMode] = useState('day')

  useEffect(() => {
    checkAdminAndLoad()
  }, [])

  async function checkAdminAndLoad() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { navigate('/login'); return }
    const role = session.user.app_metadata?.role
    if (role !== 'admin') { navigate('/'); return }
    await Promise.all([fetchBookings(), fetchBlockedDates()])
    setLoading(false)
  }

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true })
    setBookings(data || [])
  }

  async function fetchBlockedDates() {
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('date', { ascending: true })
    setBlockedDates(data || [])
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  async function handleDelete(id) {
    if (!confirm('Permanently delete this booking? This cannot be undone.')) return
    await supabase.from('bookings').delete().eq('id', id)
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  async function handleBlockDates() {
    const dates = []
    if (blockMode === 'day') {
      dates.push({ date: blockDate })
    } else {
      const weekStart = startOfWeek(parseISO(blockDate), { weekStartsOn: 0 })
      for (let i = 0; i < 7; i++) {
        dates.push({ date: format(addDays(weekStart, i), 'yyyy-MM-dd') })
      }
    }
    await supabase.from('blocked_dates').upsert(dates, { onConflict: 'date' })
    await fetchBlockedDates()
  }

  async function handleUnblock(id) {
    await supabase.from('blocked_dates').delete().eq('id', id)
    setBlockedDates(prev => prev.filter(b => b.id !== id))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  }

  const filtered = bookings.filter(b => {
    const matchDate = view === 'day' ? b.date === selectedDate : true
    const q = search.toLowerCase()
    const matchSearch = q === '' ||
      b.address?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.phone?.toLowerCase().includes(q)
    return matchDate && matchSearch
  })

  const grouped = filtered.reduce((acc, b) => {
    acc[b.date] = acc[b.date] || []
    acc[b.date].push(b)
    return acc
  }, {})

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayCount = bookings.filter(b => b.date === today).length
  const totalCount = bookings.length
  const upcomingCount = bookings.filter(b => b.date >= today).length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-black px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Link to="/"><GandyLogo /></Link>
          <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full">ADMIN</span>
        </div>
        <button onClick={handleSignOut} className="text-white/70 hover:text-white text-sm transition-colors">
          Sign Out
        </button>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <p className="text-green-700 font-semibold uppercase tracking-widest text-sm mb-1">Admin</p>
          <h1 className="text-2xl font-bold text-gray-900">Lesson Schedule</h1>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Today's Lessons", value: todayCount },
            { label: 'Upcoming', value: upcomingCount },
            { label: 'Total Bookings', value: totalCount },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-center">
              <div className="text-3xl font-bold text-green-700">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView('day')}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${view === 'day' ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Day View
            </button>
            <button
              onClick={() => setView('all')}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${view === 'all' ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setView('block')}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${view === 'block' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Block Dates
            </button>
          </div>

          {view === 'day' && (
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700 bg-white"
            />
          )}

          {view !== 'block' && (
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search lesson type, phone, notes…"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-700 bg-white"
            />
          )}
        </div>

        {view === 'day' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              {format(parseISO(selectedDate), 'EEEE, MMMM d yyyy')} — {filtered.length} lesson{filtered.length !== 1 ? 's' : ''}
            </h2>
            <div className="flex flex-col gap-3">
              {TIME_SLOTS.map(slot => {
                const booking = filtered.find(b => b.time_slot === slot)
                return (
                  <div
                    key={slot}
                    className={`flex items-start gap-4 rounded-2xl border p-5 transition-all
                      ${booking ? 'bg-white border-gray-100 shadow-sm' : 'bg-slate-50 border-dashed border-gray-200'}`}
                  >
                    <div className={`text-sm font-bold w-20 shrink-0 pt-0.5 ${booking ? 'text-green-700' : 'text-gray-300'}`}>
                      {slot}
                    </div>
                    {booking ? (
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            {booking.phone && <p className="text-sm text-gray-600 font-medium">📞 {booking.phone}</p>}
                            <p className="text-sm text-gray-600 mt-1">⛳ {booking.address}</p>
                            <p className="text-sm text-gray-400 mt-1 leading-relaxed">{booking.description}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-400 hover:text-red-600 text-xs font-bold shrink-0 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-sm italic">Available</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {view === 'all' && (
          <div>
            {Object.keys(grouped).length === 0 ? (
              <div className="text-center text-gray-400 py-16">No bookings found.</div>
            ) : (
              Object.entries(grouped).map(([date, dayBookings]) => (
                <div key={date} className="mb-8">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {format(parseISO(date), 'EEEE, MMMM d yyyy')} — {dayBookings.length} lesson{dayBookings.length !== 1 ? 's' : ''}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {dayBookings.map(booking => (
                      <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4 items-start">
                            <div className="bg-green-700 text-white rounded-xl px-3 py-2 text-center min-w-[60px] shrink-0">
                              <div className="text-xs font-semibold opacity-70 uppercase">{format(parseISO(date), 'MMM')}</div>
                              <div className="text-xl font-bold leading-none">{format(parseISO(date), 'd')}</div>
                              <div className="text-xs opacity-70 mt-0.5">{booking.time_slot}</div>
                            </div>
                            <div>
                              {booking.phone && <p className="text-sm text-gray-600 font-medium">📞 {booking.phone}</p>}
                              <p className="text-sm text-gray-600 mt-1">⛳ {booking.address}</p>
                              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{booking.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(booking.id)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium shrink-0 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === 'block' && (
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-1">Block Time Off</h2>
              <p className="text-sm text-gray-400 mb-4">Blocked dates appear as unavailable on the public calendar.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  value={blockDate}
                  onChange={e => setBlockDate(e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-400 bg-white"
                />
                <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setBlockMode('day')}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all ${blockMode === 'day' ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Single Day
                  </button>
                  <button
                    onClick={() => setBlockMode('week')}
                    className={`px-4 py-2.5 text-sm font-semibold transition-all ${blockMode === 'week' ? 'bg-green-700 text-white' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    Full Week
                  </button>
                </div>
                <button
                  onClick={handleBlockDates}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Block {blockMode === 'week' ? 'Week' : 'Day'}
                </button>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Currently Blocked ({blockedDates.length})
            </h2>
            {blockedDates.length === 0 ? (
              <div className="text-center text-gray-400 py-16">No dates blocked.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {blockedDates.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-red-100 shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                      <p className="font-medium text-gray-900">{format(parseISO(b.date), 'EEEE, MMMM d yyyy')}</p>
                    </div>
                    <button
                      onClick={() => handleUnblock(b.id)}
                      className="text-gray-400 hover:text-red-600 text-xs font-semibold transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
