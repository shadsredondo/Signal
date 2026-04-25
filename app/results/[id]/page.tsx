'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Target, MessageSquare, Mic, FileText,
  Users, ArrowRight, ChevronDown, ChevronUp, AlertTriangle,
  CheckCircle2, Minus, TrendingUp
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSession } from '@/lib/storage'
import { formatDate } from '@/lib/utils'
import type { Session, GoalScore, Alignment } from '@/types'

function GoalScoreCard({ score, label, rationale }: { score: GoalScore; label: string; rationale: string }) {
  const config = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      badge: 'success' as const,
      icon: CheckCircle2,
    },
    yellow: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      text: 'text-amber-700',
      badge: 'warning' as const,
      icon: Minus,
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      dot: 'bg-red-500',
      text: 'text-red-700',
      badge: 'danger' as const,
      icon: AlertTriangle,
    },
  }[score]

  const Icon = config.icon

  return (
    <div className={`rounded-xl border p-6 ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full ${config.dot} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={config.badge}>{score.charAt(0).toUpperCase() + score.slice(1)}</Badge>
          </div>
          <p className={`font-semibold text-base ${config.text} mb-2`}>{label}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{rationale}</p>
        </div>
      </div>
    </div>
  )
}

function AlignmentBadge({ alignment }: { alignment: Alignment }) {
  const config = {
    aligned: { label: 'Aligned', variant: 'success' as const },
    resistant: { label: 'Resistant', variant: 'danger' as const },
    neutral: { label: 'Neutral', variant: 'neutral' as const },
    political: { label: 'Political', variant: 'warning' as const },
  }[alignment]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

function ExpandableCard({
  title,
  description,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  title: string
  description?: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <Card>
      <button
        className="w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-indigo-600" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
          </div>
          {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </CardHeader>
      </button>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  )
}

export default function ResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const s = getSession(id)
    if (!s) {
      router.replace('/dashboard')
      return
    }
    setSession(s)
    setLoading(false)
  }, [params.id, router])

  if (loading || !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { coachingOutput: c, participants } = session

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            All sessions
          </Link>
          <span className="text-sm font-medium text-gray-900">Signal</span>
          <div className="w-24 text-right">
            <span className="text-xs text-gray-400">{formatDate(session.createdAt)}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
        {/* Meeting header */}
        <div className="fade-in">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-medium">Coaching report</p>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">{session.meetingTitle}</h1>
          <p className="text-sm text-gray-500">Goal: {session.userGoal}</p>
        </div>

        {/* Goal Score */}
        <div className="fade-in-1">
          <GoalScoreCard
            score={c.goalScore.color}
            label={c.goalScore.label}
            rationale={c.goalScore.rationale}
          />
        </div>

        {/* Strategic Communication */}
        <div className="fade-in-2">
          <ExpandableCard
            title="Strategic Communication"
            description="How you framed, navigated, and closed"
            icon={Target}
            defaultOpen
          >
            <div className="space-y-5">
              {c.strategicCommunication.themes.map((theme, i) => (
                <div key={i} className="border-l-2 border-indigo-200 pl-4">
                  <p className="text-sm font-semibold text-gray-900 mb-1">{theme.title}</p>
                  <p className="text-sm text-gray-600 mb-2 leading-relaxed">{theme.observation}</p>
                  <div className="flex items-start gap-2 bg-indigo-50 rounded-lg p-3">
                    <TrendingUp size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-indigo-800 leading-relaxed">{theme.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </ExpandableCard>
        </div>

        {/* Tone & Presence */}
        <div className="fade-in-3">
          <ExpandableCard
            title="Tone & Presence"
            description="How you came across and how to improve"
            icon={Mic}
            defaultOpen
          >
            <div className="space-y-6">
              {/* Overall */}
              <div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">{c.toneAndPresence.overall.summary}</p>

                {/* Patterns detected */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Patterns detected</p>
                  <ul className="space-y-1.5">
                    {c.toneAndPresence.overall.patterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-500 flex-shrink-0" />
                        {pattern}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <ul className="space-y-2">
                  {c.toneAndPresence.overall.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ArrowRight size={13} className="text-indigo-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-700 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Per participant */}
              {c.toneAndPresence.perParticipant.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Per participant</p>
                  <div className="space-y-4">
                    {c.toneAndPresence.perParticipant.map((pp, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-1">{pp.participantName}</p>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{pp.howYouCameAcross}</p>
                        <ul className="space-y-1.5">
                          {pp.recommendations.map((r, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                              <ArrowRight size={12} className="text-indigo-400 mt-1 flex-shrink-0" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ExpandableCard>
        </div>

        {/* Clarity */}
        <div className="fade-in-3">
          <ExpandableCard
            title="Clarity"
            description="Sharpness, structure, and suggested rewrites"
            icon={FileText}
          >
            <div className="space-y-6">
              <p className="text-sm text-gray-700 leading-relaxed">{c.clarity.styleOverall}</p>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Line-by-line rewrites</p>
                <div className="space-y-4">
                  {c.clarity.examples.map((ex, i) => (
                    <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="bg-red-50 border-b border-gray-200 px-4 py-3">
                        <p className="text-xs font-medium text-red-500 uppercase tracking-wider mb-1">Original</p>
                        <p className="text-sm text-gray-800 italic">"{ex.original}"</p>
                      </div>
                      <div className="bg-emerald-50 border-b border-gray-200 px-4 py-3">
                        <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">Rewrite</p>
                        <p className="text-sm text-gray-800 font-medium">"{ex.rewrite}"</p>
                      </div>
                      <div className="bg-white px-4 py-3">
                        <p className="text-xs text-gray-500">{ex.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ExpandableCard>
        </div>

        {/* Stakeholder Signals */}
        <div className="fade-in-4">
          <ExpandableCard
            title="Stakeholder Signals"
            description="What each person was signaling in the room"
            icon={Users}
          >
            <div className="space-y-4">
              {c.stakeholderSignals.map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{s.participantName}</p>
                      <p className="text-xs text-gray-500">{s.role}</p>
                    </div>
                    <AlignmentBadge alignment={s.alignment} />
                  </div>

                  <ul className="space-y-1.5 mb-3">
                    {s.signals.map((signal, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                        {signal}
                      </li>
                    ))}
                  </ul>

                  {s.hiddenConcern && (
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                      <AlertTriangle size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700">{s.hiddenConcern}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ExpandableCard>
        </div>

        {/* Next Actions */}
        <div className="fade-in-4">
          <ExpandableCard
            title="3 Moves Before Next Meeting"
            description="Specific actions to build momentum"
            icon={MessageSquare}
            defaultOpen
          >
            <div className="space-y-6">
              {/* Stakeholder specific */}
              {c.nextActions.stakeholderSpecific.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Stakeholder-specific</p>
                  <div className="space-y-3">
                    {c.nextActions.stakeholderSpecific.map((action, i) => (
                      <div key={i} className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 mb-0.5">{action.stakeholder}</p>
                          <p className="text-sm text-gray-700 leading-relaxed mb-1">{action.action}</p>
                          <p className="text-xs text-indigo-600 font-medium">{action.timing}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* General */}
              {c.nextActions.general.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">General</p>
                  <ul className="space-y-3">
                    {c.nextActions.general.map((action, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <ArrowRight size={14} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-relaxed">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ExpandableCard>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </main>
    </div>
  )
}
