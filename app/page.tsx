import Link from 'next/link'
import { ArrowRight, Lock, Target, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06060f] text-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full">
        <span className="text-white font-semibold text-lg tracking-tight">Signal</span>
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          My sessions
        </Link>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto w-full py-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400 mb-10 fade-in">
          Private by design · Built for ambitious professionals
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] mb-6 fade-in-1">
          Become sharper in every
          <br />
          <span className="text-indigo-400">important conversation.</span>
        </h1>

        {/* Subhead */}
        <p className="text-lg text-gray-400 max-w-xl leading-relaxed mb-12 fade-in-2">
          Upload a meeting transcript and get private coaching on what happened,
          what you missed, and what to say next.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-20 fade-in-3">
          <Link
            href="/new"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-all duration-150 text-sm shadow-lg shadow-indigo-600/25"
          >
            Try your first meeting
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            View past sessions
          </Link>
        </div>

        {/* Trust cues */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl w-full fade-in-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Lock size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Private by design</p>
              <p className="text-xs text-gray-500 mt-0.5">Your transcripts never leave your session</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Target size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Personalized to your role</p>
              <p className="text-xs text-gray-500 mt-0.5">Coaching shaped by your goals and context</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Actionable in 60 seconds</p>
              <p className="text-xs text-gray-500 mt-0.5">Specific next steps, not generic advice</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-xs text-gray-600">
        Signal — Communication coaching for ambitious professionals
      </footer>
    </div>
  )
}
