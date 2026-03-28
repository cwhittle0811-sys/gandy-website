import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-[#1d4ed8] px-6 py-4">
        <Link to="/" className="text-white font-bold text-lg tracking-tight">Gandy Golf</Link>
      </nav>
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose text-gray-600 text-sm leading-relaxed space-y-4">
          <p>By booking a lesson, you agree to these terms. Lessons must be cancelled at least 24 hours in advance for a full refund. No-shows will be charged the full lesson fee.</p>
          <p>Gandy Golf reserves the right to reschedule or cancel lessons due to weather or other circumstances beyond our control. We will provide as much notice as possible.</p>
          <p>All information provided is used solely to facilitate lesson bookings and communication. We do not sell or share your data with third parties.</p>
          <p>These terms are subject to change. Continued use of the booking system constitutes acceptance of any updated terms.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
