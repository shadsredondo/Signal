'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getDraft, clearDraft, saveSession } from '@/lib/storage'
import { getAllRoles, addCustomRole } from '@/lib/default-roles'
import { generateMockCoaching } from '@/lib/mock-coaching'
import { generateId } from '@/lib/utils'
import type { Participant, DraftSession } from '@/types'

const GOAL_SUGGESTIONS = [
  'Gain approval',
  'Influence decision',
  'Build trust',
  'Align on roadmap',
  'Resolve conflict',
  'Present findings',
]

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'
}

function parseNameAndRole(raw: string): { name: string; role: string } {
  const match = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/)
  if (match) return { name: match[1].trim(), role: match[2].trim() }
  return { name: raw.trim(), role: '' }
}

function RoleInput({
  value,
  roles,
  onChange,
}: {
  value: string
  roles: string[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value)

  useEffect(() => { setQuery(value) }, [value])

  const filtered = query.trim()
    ? roles.filter(r => r.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : roles.slice(0, 6)

  function select(role: string) {
    onChange(role)
    setQuery(role)
    setOpen(false)
  }

  function handleBlur() {
    setTimeout(() => setOpen(false), 150)
    if (query.trim() && !roles.includes(query.trim())) {
      addCustomRole(query.trim())
      onChange(query.trim())
    } else if (!query.trim()) {
      onChange('')
    }
  }

  return (
    <div className="relative flex-1">
      <input
        className="w-full px-3 py-2 text-sm bg-transparent border-0 border-b border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-700 placeholder-gray-400 transition-colors"
        placeholder="Their role…"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 top-full mt-1 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden">
          {filtered.map(r => (
            <li key={r}>
              <button
                type="button"
                onMouseDown={() => select(r)}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ParticipantRow({
  participant,
  roles,
  onUpdate,
  onRemove,
}: {
  participant: Participant
  roles: string[]
  onUpdate: (p: Participant) => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center">
        <span className="text-xs font-semibold text-indigo-600">
          {getInitials(participant.name)}
        </span>
      </div>

      {/* Name */}
      <input
        className="w-0 flex-[2] px-0 py-1 text-sm font-medium text-gray-900 bg-transparent border-0 border-b border-gray-200 focus:border-indigo-400 focus:outline-none placeholder-gray-400 transition-colors min-w-0"
        placeholder="Name"
        value={participant.name}
        onChange={e => onUpdate({ ...participant, name: e.target.value })}
      />

      {/* Divider */}
      <div className="flex-shrink-0 w-px h-5 bg-gray-200" />

      {/* Role */}
      <RoleInput
        value={participant.role}
        roles={roles}
        onChange={role => onUpdate({ ...participant, role })}
      />

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export default function ConfirmPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<DraftSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])
  const [customGoal, setCustomGoal] = useState('')
  const [roles, setRoles] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const d = getDraft()
    if (!d) { router.replace('/new'); return }
    setDraft(d)
    setRoles(getAllRoles())

    const detected: Participant[] = d.detectedParticipants.map(raw => {
      const { name, role } = parseNameAndRole(raw)
      return { id: generateId(), name, role, importance: 'high', isUser: false }
    })

    if (detected.length === 0) {
      detected.push(
        { id: generateId(), name: '', role: '', importance: 'high', isUser: true },
        { id: generateId(), name: '', role: '', importance: 'high', isUser: false }
      )
    }

    setParticipants(detected)
  }, [router])

  const updateParticipant = useCallback((id: string, updated: Participant) => {
    setParticipants(prev => prev.map(p => p.id === id ? updated : p))
  }, [])

  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id))
  }, [])

  function addParticipant() {
    setParticipants(prev => [
      ...prev,
      { id: generateId(), name: '', role: '', importance: 'high', isUser: false },
    ])
  }

  function validate() {
    const e: Record<string, string> = {}
    if (selectedGoals.length === 0 && !customGoal.trim()) e.goal = 'Select at least one goal.'
    if (participants.filter(p => p.name.trim()).length === 0) e.participants = 'Add at least one participant.'
    return e
  }

  async function handleGenerate() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setIsGenerating(true)
    const goal = [...selectedGoals, customGoal.trim()].filter(Boolean).join(', ')
    const filledParticipants = participants.filter(p => p.name.trim())
    const coaching = generateMockCoaching(goal, filledParticipants, draft?.userTitle || '')

    const session = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      transcript: draft!.transcript,
      transcriptFormat: draft!.transcriptFormat,
      userGoal: [...selectedGoals, customGoal.trim()].filter(Boolean).join(', '),
      userTitle: draft!.userTitle,
      userFunction: draft!.userFunction,
      userSeniority: draft!.userSeniority,
      meetingTitle: draft!.meetingTitle || 'Untitled meeting',
      participants: filledParticipants,
      coachingOutput: coaching,
      goalScore: coaching.goalScore.color,
    }

    saveSession(session)
    clearDraft()
    router.push(`/results/${session.id}`)
  }

  if (!draft) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/new" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            Back
          </Link>
          <span className="text-sm font-medium text-gray-900">Signal</span>
          <div className="w-16" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Who was in the room?</h1>
          <p className="text-sm text-gray-400">
            {draft.detectedParticipants.length > 0
              ? `We found ${draft.detectedParticipants.length} participant${draft.detectedParticipants.length > 1 ? 's' : ''} in your transcript.`
              : 'Add the people who were in this meeting.'}
          </p>
        </div>

        {/* Column headers */}
        <div className="flex items-center gap-4 px-4 mb-2 fade-in-1">
          <div className="w-9 flex-shrink-0" />
          <span className="flex-[2] text-xs font-medium text-gray-400 uppercase tracking-wide">Name</span>
          <div className="w-px flex-shrink-0" />
          <span className="flex-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Role</span>
          <div className="w-7 flex-shrink-0" />
        </div>

        {/* Participants */}
        <div className="space-y-2 mb-4 fade-in-1">
          {participants.map(p => (
            <ParticipantRow
              key={p.id}
              participant={p}
              roles={roles}
              onUpdate={updated => updateParticipant(p.id, updated)}
              onRemove={() => removeParticipant(p.id)}
            />
          ))}
        </div>

        {errors.participants && (
          <p className="text-xs text-red-400 mb-3 px-1">{errors.participants}</p>
        )}

        <button
          type="button"
          onClick={addParticipant}
          className="flex items-center gap-1.5 text-sm text-indigo-500 hover:text-indigo-600 font-medium mb-12 px-1 fade-in-2"
        >
          <Plus size={14} />
          Add someone
        </button>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-8" />

        {/* Goal section */}
        <div className="mb-10 fade-in-3">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            What did you want from this meeting?
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Be specific — this shapes your entire coaching report.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {GOAL_SUGGESTIONS.map(suggestion => {
              const active = selectedGoals.includes(suggestion)
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setSelectedGoals(prev =>
                      active ? prev.filter(g => g !== suggestion) : [...prev, suggestion]
                    )
                    if (errors.goal) setErrors(prev => ({ ...prev, goal: '' }))
                  }}
                  className={`px-3.5 py-1.5 text-sm rounded-full border transition-all ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {suggestion}
                </button>
              )
            })}
          </div>

          <Input
            placeholder="Add your own goal…"
            value={customGoal}
            onChange={e => {
              setCustomGoal(e.target.value)
              if (errors.goal) setErrors(prev => ({ ...prev, goal: '' }))
            }}
            error={errors.goal}
          />
        </div>

        {/* CTA */}
        <div className="fade-in-4">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Generating coaching…' : 'Generate my coaching'}
            {!isGenerating && <ArrowRight size={16} />}
          </Button>
        </div>
      </main>
    </div>
  )
}
