import GandyLogo from '../components/GandyLogo'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format, addDays } from 'date-fns'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

// END_TIMES[i] = the end label when starting at TIME_SLOTS[i]
const END_TIMES = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
]

const LESSON_TYPES = [
  'Individual Lesson',
  'Group Clinic',
  'Junior Lesson',
  'On-Course Playing Lesson',
]

// Expand a stored time_slot (e.g. "9:00 AM – 11:00 AM") to individual hour slots
function expandSlot(slot) {
  if (!slot.includes(' – ')) return [slot]
  const [start, end] = slot.split(' – ')
  const si = TIME_SLOTS.indexOf(start)
  const ei = END_TIMES.indexOf(end)
  if (si === -1 || ei === -1) return [slot]
  return TIME_SLOTS.slice(si, ei + 1)
}

export default function BookLesson() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [date, setDate] = useState(location.state?.date || format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const [startTime, setStartTime] = useState('')
  const [duration, setDuration] = useState(0)
  const [lessonType, setLessonType] = useState(LESSON_TYPES[0])
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [notes, setNotes] = useState('')
  const [rawBookedSlots, setRawBookedSlots] = useState([])
  const [isDateBlocked, setIsDateBlocked] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!date) return
    setStartTime('')
    setDuration(0)
    supabase
      .from('bookings')
      .select('time_slot')
      .eq('date', date)
      .then(({ data }) => setRawBookedSlots((data || []).map(b => b.time_slot)))
    supabase
      .from('blocked_dates')
      .select('id')
      .eq('date', date)
      .then(({ data }) => setIsDateBlocked((data || []).length > 0))
  }, [date])

  // Expand all stored slots to individual occupied hours
  const occupiedHours = rawBookedSlots.flatMap(expandSlot)

  function maxDurationFrom(start) {
    const si = TIME_SLOTS.indexOf(start)
    let count = 0
    for (let i = si; i < TIME_SLOTS.length; i++) {
      if (occupiedHours.includes(TIME_SLOTS[i])) break
      count++
    }
    return Math.min(count, 3)
  }

  const durationOptions = startTime ? [1, 2, 3].filter(d => d <= maxDurationFrom(startTime)) : []

  const si = TIME_SLOTS.indexOf(startTime)
  const endTime = duration > 0 && si !== -1 ? END_TIMES[si + duration - 1] : ''
  const timeSlot = startTime && duration > 0 ? `${startTime} – ${endTime}` : ''

  async function handleSubmit(e) {
    e.preventDefault()
    if (isDateBlocked) { setError('This date is unavailable. Please choose a different date.'); return }
    if (!startTime) { setError('Please select a start time.'); return }
    if (!duration) { setError('Please select a duration.'); return }
    if (!/^[\d\s\-\+\(\)]{7,20}$/.test(phone.trim())) {
      setError('Please enter a valid phone number.')
      return
    }
    setError('')
    setSubmitting(true)

    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      date,
      time_slot: timeSlot,
      address: lessonType,
      phone,
      description: `Experience: ${experience}${notes ? ' | Notes: ' + notes : ''}`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setSubmitting(false)
  }

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-black px-6 py-4 flex items-center justify-between">
          <Link to="/"><GandyLogo markSize={32} /></Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to book</h2>
            <p className="text-gray-500 mb-6">You need an account to schedule a lesson.</p>
            <div className="flex flex-col gap-3">
              <Link to="/signup" className="bg-white hover:bg-sky-50 text-sky-500 font-bold py-3 rounded-full transition-all">Create Account</Link>
              <Link to="/login" className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-full transition-all">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-black px-6 py-4 flex items-center justify-between">
          <Link to="/"><GandyLogo markSize={32} /></Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">⛳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're booked!</h2>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">{format(new Date(date + 'T12:00:00'), 'EEEE, MMMM d')}</span>
            </p>
            <p className="text-gray-600 font-semibold mb-1">{timeSlot}</p>
            <p className="text-gray-400 text-sm mb-6">{lessonType} — see you on the course!</p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-full transition-all">View My Lessons</Link>
              <Link to="/" className="text-sky-500 font-semibold hover:text-sky-600 py-2">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-black px-6 py-4 flex items-center justify-between">
        <Link to="/"><GandyLogo markSize={32} /></Link>
        <Link to="/dashboard" className="text-white/80 hover:text-white text-sm font-medium">My Lessons</Link>
      </nav>

      <div className="flex-1 px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sky-500 font-semibold uppercase tracking-widest text-sm mb-2">Schedule a Session</p>
            <h1 className="text-3xl font-bold text-gray-900">Book a Golf Lesson</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Lesson Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Lesson Type</label>
                <select
                  value={lessonType}
                  onChange={e => setLessonType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white"
                >
                  {LESSON_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Date picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  onChange={e => setDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Start Time */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Start Time</label>
                  {!isDateBlocked && occupiedHours.length > 0 && (
                    <span className="text-xs text-gray-400">{occupiedHours.length} hour{occupiedHours.length !== 1 ? 's' : ''} booked</span>
                  )}
                </div>
                {isDateBlocked ? (
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3">
                    This date is unavailable. Please choose a different date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const taken = occupiedHours.includes(slot)
                      const selected = startTime === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => { setStartTime(slot); setDuration(0) }}
                          className={`py-2.5 rounded-xl text-sm font-medium border transition-all
                            ${taken ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through' : ''}
                            ${selected ? 'bg-sky-500 border-sky-500 text-white font-bold shadow-md' : ''}
                            ${!taken && !selected ? 'bg-white border-gray-200 text-gray-700 hover:border-sky-400 hover:bg-sky-50' : ''}
                          `}
                        >
                          {taken ? 'Booked' : slot}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Duration */}
              {startTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <div className="flex gap-3">
                    {durationOptions.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No available duration from this start time.</p>
                    ) : (
                      durationOptions.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDuration(d)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all
                            ${duration === d
                              ? 'bg-sky-500 border-sky-500 text-white shadow-md'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-sky-400 hover:bg-sky-50'
                            }`}
                        >
                          {d} hr{d > 1 ? 's' : ''}
                        </button>
                      ))
                    )}
                  </div>
                  {duration > 0 && (
                    <p className="text-xs text-sky-600 font-semibold mt-2">
                      {startTime} – {endTime} ({duration} hour{duration > 1 ? 's' : ''})
                    </p>
                  )}
                </div>
              )}

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 555-0123"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Experience level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Golf Experience</label>
                <select
                  required
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select your level…</option>
                  <option>Complete beginner</option>
                  <option>Casual / occasional golfer</option>
                  <option>Intermediate (100+ rounds)</option>
                  <option>Competitive / low handicap</option>
                  <option>Junior golfer</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Goals or Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Want to improve my driver, fix a slice, work on short game…"
                  rows={3}
                  maxLength={500}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !startTime || !duration}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-60 shadow-lg"
              >
                {submitting ? 'Booking…' : 'Confirm Lesson'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
