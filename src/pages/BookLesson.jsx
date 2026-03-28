import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { format, addDays } from 'date-fns'

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

const LESSON_TYPES = [
  'Individual Lesson (60 min)',
  'Individual Lesson (30 min)',
  'Group Clinic',
  'Junior Lesson',
  'On-Course Playing Lesson',
]

export default function BookLesson() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [date, setDate] = useState(location.state?.date || format(addDays(new Date(), 1), 'yyyy-MM-dd'))
  const [timeSlot, setTimeSlot] = useState('')
  const [lessonType, setLessonType] = useState(LESSON_TYPES[0])
  const [phone, setPhone] = useState('')
  const [experience, setExperience] = useState('')
  const [notes, setNotes] = useState('')
  const [bookedSlots, setBookedSlots] = useState([])
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
    supabase
      .from('bookings')
      .select('time_slot')
      .eq('date', date)
      .then(({ data }) => setBookedSlots((data || []).map(b => b.time_slot)))
    supabase
      .from('blocked_dates')
      .select('id')
      .eq('date', date)
      .then(({ data }) => setIsDateBlocked((data || []).length > 0))
  }, [date])

  async function handleSubmit(e) {
    e.preventDefault()
    if (isDateBlocked) { setError('This date is unavailable. Please choose a different date.'); return }
    if (!timeSlot) { setError('Please select a time slot.'); return }
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
        <nav className="bg-[#1d4ed8] px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-lg tracking-tight">Gandy Golf</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to book</h2>
            <p className="text-gray-500 mb-6">You need an account to schedule a lesson.</p>
            <div className="flex flex-col gap-3">
              <Link to="/signup" className="bg-white hover:bg-sky-50 text-[#1d4ed8] font-bold py-3 rounded-full transition-all">Create Account</Link>
              <Link to="/login" className="bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold py-3 rounded-full transition-all">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-[#1d4ed8] px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-white font-bold text-lg tracking-tight">Gandy Golf</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">⛳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're booked!</h2>
            <p className="text-gray-500 mb-2">
              <span className="font-semibold text-gray-700">{format(new Date(date + 'T12:00:00'), 'EEEE, MMMM d')}</span> at <span className="font-semibold text-gray-700">{timeSlot}</span>
            </p>
            <p className="text-gray-400 text-sm mb-6">{lessonType} — see you on the course!</p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard" className="bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold py-3 rounded-full transition-all">View My Lessons</Link>
              <Link to="/" className="text-sky-500 font-semibold hover:text-sky-600 py-2">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-[#1d4ed8] px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-lg tracking-tight">Gandy Golf</Link>
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all bg-white"
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
                  onChange={e => { setDate(e.target.value); setTimeSlot('') }}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all"
                />
              </div>

              {/* Time slots */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Select Time Slot</label>
                  {!isDateBlocked && <span className="text-xs text-gray-400">{bookedSlots.length} slot{bookedSlots.length !== 1 ? 's' : ''} taken</span>}
                </div>
                {isDateBlocked ? (
                  <div className="bg-gray-50 border border-gray-200 text-gray-600 text-sm rounded-xl px-4 py-3">
                    This date is unavailable. Please choose a different date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map(slot => {
                      const taken = bookedSlots.includes(slot)
                      const selected = timeSlot === slot
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={taken}
                          onClick={() => !taken && setTimeSlot(slot)}
                          className={`py-2.5 rounded-xl text-sm font-medium border transition-all
                            ${taken ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through' : ''}
                            ${selected ? 'bg-white border-sky-400 text-gray-900 font-bold shadow-md' : ''}
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

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 555-0123"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all"
                />
              </div>

              {/* Experience level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Golf Experience</label>
                <select
                  required
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all bg-white"
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
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1d4ed8] focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1d4ed8] hover:bg-[#2563eb] text-white font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-60 shadow-lg"
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
