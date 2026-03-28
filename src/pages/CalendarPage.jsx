import GandyLogo from '../components/GandyLogo'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  isPast,
  startOfDay,
} from 'date-fns'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]
const END_TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
]

function expandSlot(slot) {
  if (!slot.includes(' – ')) return [slot]
  const [start, end] = slot.split(' – ')
  const si = TIME_SLOTS.indexOf(start)
  const ei = END_TIMES.indexOf(end)
  if (si === -1 || ei === -1) return [slot]
  return TIME_SLOTS.slice(si, ei + 1)
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])
  const [blockedDates, setBlockedDates] = useState([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [currentMonth])

  async function fetchBookings() {
    setLoading(true)
    const start = format(startOfMonth(currentMonth), 'yyyy-MM-dd')
    const end = format(endOfMonth(currentMonth), 'yyyy-MM-dd')
    const [availRes, blockedRes] = await Promise.all([
      supabase.rpc('get_availability', { p_start: start, p_end: end }),
      supabase.from('blocked_dates').select('date').gte('date', start).lte('date', end),
    ])
    setBookedSlots(availRes.data || [])
    setBlockedDates((blockedRes.data || []).map(b => b.date))
    setLoading(false)
  }

  function getOccupiedHoursForDay(date) {
    const d = format(date, 'yyyy-MM-dd')
    return bookedSlots.filter(b => b.date === d).map(b => b.time_slot).flatMap(expandSlot)
  }

  function isFullyBooked(date) {
    return getOccupiedHoursForDay(date).length >= TIME_SLOTS.length
  }

  function isBlocked(date) {
    return blockedDates.includes(format(date, 'yyyy-MM-dd'))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)
  const days = []
  let d = gridStart
  while (d <= gridEnd) {
    days.push(d)
    d = addDays(d, 1)
  }

  const selectedBooked = selectedDay ? getOccupiedHoursForDay(selectedDay) : []

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-black px-6 py-4 flex items-center justify-between shadow-lg">
        <Link to="/"><GandyLogo markSize={32} /></Link>
        <div className="flex gap-3 items-center">
          {session ? (
            <Link to="/dashboard" className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 transition-colors">My Lessons</Link>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium px-4 py-2 transition-colors">Log In</Link>
          )}
          <Link to="/book" className="bg-white hover:bg-sky-50 text-sky-500 text-sm font-bold px-5 py-2 rounded-full transition-all">Book Now</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-sky-500 font-semibold uppercase tracking-widest text-sm mb-2">Live Schedule</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Availability Calendar</h1>
          <p className="text-gray-500">Green = available · Red = fully booked. Click a day to see open time slots.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-white/70 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ‹
            </button>
            <h2 className="text-white font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-white/70 hover:text-white transition-colors text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
          ) : (
            <div className="grid grid-cols-7">
              {days.map((day, i) => {
                const inMonth = isSameMonth(day, currentMonth)
                const past = isPast(startOfDay(day)) && !isToday(day)
                const blocked = inMonth && !past && isBlocked(day)
                const booked = inMonth && !past && !blocked && isFullyBooked(day)
                const selected = selectedDay && isSameDay(day, selectedDay)
                const today = isToday(day)
                const unavailable = blocked || booked

                return (
                  <button
                    key={i}
                    disabled={!inMonth || past || blocked}
                    onClick={() => inMonth && !past && !blocked && setSelectedDay(day)}
                    className={`
                      relative h-16 flex flex-col items-center justify-center gap-1 border-b border-r border-gray-50
                      transition-all text-sm font-medium
                      ${!inMonth ? 'text-gray-200 cursor-default' : ''}
                      ${past ? 'text-gray-300 cursor-default bg-gray-50/50' : ''}
                      ${blocked ? 'bg-gray-100 cursor-not-allowed' : ''}
                      ${inMonth && !past && !unavailable ? 'hover:bg-green-50 cursor-pointer' : ''}
                      ${inMonth && !past && booked ? 'bg-red-50 cursor-not-allowed' : ''}
                      ${selected ? 'ring-2 ring-inset ring-sky-500 bg-sky-50' : ''}
                    `}
                  >
                    <span className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-sm
                      ${today ? 'bg-sky-500 text-white font-bold' : ''}
                      ${blocked ? 'text-gray-400' : ''}
                      ${inMonth && !past && !today && !blocked ? 'text-gray-700' : ''}
                    `}>
                      {format(day, 'd')}
                    </span>
                    {inMonth && !past && (
                      <span className={`w-1.5 h-1.5 rounded-full ${blocked ? 'bg-gray-400' : booked ? 'bg-red-400' : 'bg-green-400'}`} />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {selectedDay && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">{format(selectedDay, 'EEEE, MMMM d')}</h3>
              <Link
                to="/book"
                state={{ date: format(selectedDay, 'yyyy-MM-dd') }}
                className="bg-white hover:bg-sky-50 text-gray-900 font-bold px-5 py-2 rounded-full text-sm transition-all"
              >
                Book This Day
              </Link>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {TIME_SLOTS.map(slot => {
                const taken = selectedBooked.includes(slot)
                return (
                  <div
                    key={slot}
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium text-center border transition-all
                      ${taken
                        ? 'bg-red-50 border-red-200 text-red-400 line-through cursor-not-allowed'
                        : 'bg-green-50 border-green-200 text-green-700'
                      }`}
                  >
                    {taken ? 'Booked' : slot}
                  </div>
                )
              })}
            </div>
            <p className="text-gray-400 text-xs mt-4">* Booked slots show only "Booked" — customer details are private.</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center flex-wrap gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-400" />Available</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-400" />Fully Booked</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-gray-400" />Unavailable</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white" />Selected</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
