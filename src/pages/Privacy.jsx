import GandyLogo from '../components/GandyLogo'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-black px-6 py-4">
        <Link to="/"><GandyLogo /></Link>
      </nav>
      <div className="flex-1 max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose text-gray-600 text-sm leading-relaxed space-y-4">
          <p>We collect your name, email, and phone number solely to manage lesson bookings and communicate with you about your appointments.</p>
          <p>Your data is stored securely using Supabase and is never sold to or shared with third parties.</p>
          <p>You may request deletion of your account and associated data at any time by contacting us at info@gandygolf.com.</p>
          <p>This site uses cookies only for authentication purposes.</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
