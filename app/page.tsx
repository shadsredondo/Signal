import Link from 'next/link'
import { ArrowRight, Lock, Target, Zap, Check } from 'lucide-react'

const SAMPLE_STRENGTHS = [
  'Strong framing — established why Q3 timing mattered before asking for resources',
  'Led with business impact, not feature detail, which aligned the room early',
]

const SAMPLE_MOVES = [
  'Send Marcus a 3-bullet follow-up anchoring the decision and your ask — within 24 hours',
  'Address the "why now?" objection head-on before it resurfaces at the leadership level',
  'Replace "I think we should" with "I recommend" — same idea, significantly more authority',
]

const SAMPLE_AREAS = [
  {
    label: 'Strategic Communication',
    teaser: 'You closed without a named owner or next step — giving opponents of your proposal time to reframe offline.',
  },
  {
    label: 'Tone & Presence',
    teaser: 'Filler phrases ("kind of", "sort of") appeared 8+ times under pressure, signalling uncertainty to senior stakeholders.',
  },
  {
    label: 'Clarity',
    teaser: 'Three key answers ran 25–30% longer than needed. Senior audiences scan for the signal — extra words dilute it.',
  },
]

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
      <main className="flex flex-col items-center px-6 text-center max-w-4xl mx-auto w-full pt-24 pb-12">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl w-full fade-in-4 mb-28">
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

      {/* Sample report preview */}
      <section className="w-full max-w-3xl mx-auto px-6 pb-0">
        {/* Section label */}
        <div className="text-center mb-8">
          <span className="inline-block text-xs font-semibold tracking-widest text-indigo-400 uppercase border border-indigo-500/30 bg-indigo-500/10 rounded-full px-4 py-1.5 mb-4">
            Sample report
          </span>
          <p className="text-gray-400 text-sm">
            Senior PM · Q3 roadmap meeting · Goal: gain approval for the onboarding initiative
          </p>
        </div>

        {/* Signal Summary card */}
        <div className="bg-white rounded-2xl overflow-hidden mb-4 shadow-2xl shadow-black/40">
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            {/* What landed */}
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">What landed</p>
              <ul className="space-y-3">
                {SAMPLE_STRENGTHS.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check size={9} className="text-emerald-600" />
                    </span>
                    <span className="text-sm text-gray-700 leading-snug">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Next 3 moves */}
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your next 3 moves</p>
              <ol className="space-y-3">
                {SAMPLE_MOVES.map((m, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-indigo-600">
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug">{m}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Coaching area teasers */}
        <div className="grid grid-cols-3 gap-3 mb-0">
          {SAMPLE_AREAS.map((area, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-indigo-300 mb-2">{area.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{area.teaser}</p>
            </div>
          ))}
        </div>

        {/* Gradient fade */}
        <div className="relative h-40 -mt-2 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#06060f]" />
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pb-20 px-6">
        <p className="text-sm text-gray-500 mb-4">This is what your next meeting could look like.</p>
        <Link
          href="/new"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-lg transition-all duration-150 text-sm shadow-lg shadow-indigo-600/25"
        >
          Analyse your first meeting
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Footer */}
      <footer className="px-8 py-6 text-center text-xs text-gray-600">
        Signal — Communication coaching for ambitious professionals
      </footer>
    </div>
  )
}
