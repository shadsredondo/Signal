'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, ChevronRight, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getSessions, deleteSession } from '@/lib/storage'
import { formatDate } from '@/lib/utils'
import type { Session, GoalScore } from '@/types'

function ScoreDot({ score }: { score: GoalScore }) {
  const colors = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-400',
    red: 'bg-red-500',
  }
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[score]}`} />
}

function ScoreBadge({ score }: { score: GoalScore }) {
  const config = {
    green: { variant: 'success' as const, label: 'Strong' },
    yellow: { variant: 'warning' as const, label: 'Partial' },
    red: { variant: 'danger' as const, label: 'Off track' },
  }[score]
  return <Badge variant={config.variant}>{config.label}</Badge>
}

function SessionCard({ session, onDelete }: { session: Session; onDelete: () => void }) {
  const userParticipant = session.participants.find(p => p.isUser)
  const otherParticipants = session.participants.filter(p => !p.isUser)

  return (
    <div className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all duration-150">
      <Link href={`/results/${session.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ScoreDot score={session.goalScore} />
              <h3 className="text-sm font-semibold text-gray-900 truncate">{session.meetingTitle}</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3 truncate">{session.userGoal}</p>

            <div className="flex items-center gap-3 flex-wrap">
              <ScoreBadge score={session.goalScore} />
              {otherParticipants.slice(0, 3).map(p => (
                <span key={p.id} className="text-xs text-gray-500">
                  {p.name}{p.role ? ` · ${p.role}` : ''}
                </span>
              ))}
              {otherParticipants.length > 3 && (
                <span className="text-xs text-gray-400">+{otherParticipants.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs text-gray-400">{formatDate(session.createdAt)}</span>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
          </div>
        </div>
      </Link>

      {/* Delete action */}
      <div className="px-5 pb-4 flex justify-end">
        <button
          onClick={e => {
            e.preventDefault()
            if (confirm('Delete this session?')) onDelete()
          }}
          className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
        >
          <Trash2 size={11} />
          Delete
        </button>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setSessions(getSessions())
    setLoaded(true)
  }, [])

  function handleDelete(id: string) {
    deleteSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const greenCount = sessions.filter(s => s.goalScore === 'green').length
  const yellowCount = sessions.filter(s => s.goalScore === 'yellow').length
  const redCount = sessions.filter(s => s.goalScore === 'red').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
            Signal
          </Link>
          <Link href="/new">
            <Button size="sm" className="flex items-center gap-1.5">
              <Plus size={14} />
              New session
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">My sessions</h1>
          <p className="text-sm text-gray-500">Your coaching history across past conversations.</p>
        </div>

        {/* Stats — only show if sessions exist */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 fade-in-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{sessions.length}</div>
              <div className="text-xs text-gray-500">Sessions analyzed</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-2xl font-bold text-emerald-600">{greenCount}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-lg font-semibold text-amber-500">{yellowCount}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-lg font-semibold text-red-500">{redCount}</span>
              </div>
              <div className="text-xs text-gray-500">Strong / Partial / Off track</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {sessions.length > 0
                  ? Math.round((greenCount / sessions.length) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-500">Goal achievement rate</div>
            </div>
          </div>
        )}

        {/* Session list */}
        {!loaded ? (
          <div className="flex justify-center py-20">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 fade-in">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4">
              <ArrowRight size={20} className="text-indigo-400" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">No sessions yet</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
              Upload your first meeting transcript to get personalized coaching.
            </p>
            <Link href="/new">
              <Button className="flex items-center gap-2">
                Try your first meeting
                <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 fade-in-2">
            {sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={() => handleDelete(session.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
