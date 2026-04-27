'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Plus, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getDraft, clearDraft, saveSession } from '@/lib/storage'
import { ROLE_GROUPS, DEFAULT_ROLES, getAllRoles, addCustomRole } from '@/lib/default-roles'
import { generateMockCoaching } from '@/lib/mock-coaching'
import { generateId } from '@/lib/utils'
import type { Participant, Importance, DraftSession } from '@/types'

const IMPORTANCE_OPTIONS: { value: Importance; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'bg-red-50 text-red-700 border-red-200' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-600 border-gray-200' },
]

const GOAL_SUGGESTIONS = [
  'Gain approval',
  'Influence decision',
  'Build trust',
  'Align on roadmap',
  'Resolve conflict',
  'Present findings',
]

function ParticipantRow({
  participant,
  customRoles,
  onUpdate,
  onRemove,
  onCustomRoleAdded,
}: {
  participant: Participant
  customRoles: string[]
  onUpdate: (p: Participant) => void
  onRemove: () => void
  onCustomRoleAdded: (role: string) => void
}) {
  const [showCustomRole, setShowCustomRole] = useState(false)
  const [customRole, setCustomRole] = useState('')

  function handleRoleChange(role: string) {
    if (role === '__custom__') {
      setShowCustomRole(true)
    } else {
      onUpdate({ ...participant, role })
    }
  }

  function handleCustomRoleSubmit() {
    if (customRole.trim()) {
      const role = customRole.trim()
      addCustomRole(role)
      onUpdate({ ...participant, role })
      onCustomRoleAdded(role)
      setShowCustomRole(false)
      setCustomRole('')
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200">
      <div className="flex items-start gap-3">
        {/* Name */}
        <div className="flex-1">
          <Input
            placeholder="Participant name"
            value={participant.name}
            onChange={e => onUpdate({ ...participant, name: e.target.value })}
          />
        </div>

        {/* User toggle */}
        <button
          type="button"
          onClick={() => onUpdate({ ...participant, isUser: !participant.isUser })}
          title="Mark as you"
          className={`flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
            participant.isUser
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-gray-300 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
          }`}
        >
          <User size={14} />
        </button>

        {/* Remove */}
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-all"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex gap-3 items-start">
        {/* Role select */}
        <div className="flex-1">
          {showCustomRole ? (
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-indigo-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter custom role"
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomRoleSubmit()}
                autoFocus
              />
              <Button size="sm" onClick={handleCustomRoleSubmit}>Add</Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCustomRole(false)}>Cancel</Button>
            </div>
          ) : (
            <select
              value={participant.role}
              onChange={e => handleRoleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="">Select role…</option>
              {ROLE_GROUPS.map(group => (
                <optgroup key={group.label} label={group.label}>
                  {group.roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              ))}
              {customRoles.length > 0 && (
                <optgroup label="Custom">
                  {customRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              )}
              <option value="__custom__">+ Add custom role…</option>
            </select>
          )}
        </div>

        {/* Importance */}
        <div className="flex gap-1">
          {IMPORTANCE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onUpdate({ ...participant, importance: opt.value })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-all ${
                participant.importance === opt.value
                  ? opt.color
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {participant.isUser && (
        <div className="text-xs text-indigo-600 font-medium">This is you</div>
      )}
    </div>
  )
}

export default function ConfirmPage() {
  const router = useRouter()
  const [draft, setDraft] = useState<DraftSession | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [goal, setGoal] = useState('')
  const [customRoles, setCustomRoles] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const d = getDraft()
    if (!d) {
      router.replace('/new')
      return
    }
    setDraft(d)
    setCustomRoles(getAllRoles().filter(r => !DEFAULT_ROLES.includes(r as string)))

    // Pre-populate participants from detected speakers
    const detected: Participant[] = d.detectedParticipants.map(name => ({
      id: generateId(),
      name,
      role: '',
      importance: 'medium' as Importance,
      isUser: false,
    }))

    // If no speakers detected, add two blank rows
    if (detected.length === 0) {
      detected.push(
        { id: generateId(), name: '', role: '', importance: 'medium', isUser: true },
        { id: generateId(), name: '', role: '', importance: 'medium', isUser: false }
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
      { id: generateId(), name: '', role: '', importance: 'medium', isUser: false },
    ])
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!goal.trim()) e.goal = 'What did you want from this meeting?'
    const filled = participants.filter(p => p.name.trim())
    if (filled.length === 0) e.participants = 'Add at least one participant.'
    return e
  }

  async function handleGenerate() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    setIsGenerating(true)

    const filledParticipants = participants.filter(p => p.name.trim())
    const coaching = generateMockCoaching(goal, filledParticipants, draft?.userTitle || '')

    const session = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      transcript: draft!.transcript,
      transcriptFormat: draft!.transcriptFormat,
      userGoal: goal,
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
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/new" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft size={16} />
            Back
          </Link>
          <span className="text-sm font-medium text-gray-900">Signal</span>
          <div className="w-16" />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 fade-in">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Who was in the room?</h1>
          <p className="text-sm text-gray-500">
            {draft.detectedParticipants.length > 0
              ? `We found ${draft.detectedParticipants.length} participant${draft.detectedParticipants.length > 1 ? 's' : ''} in your transcript. Review and add roles.`
              : 'Add the people who were in this meeting.'}
          </p>
        </div>

        {/* Participants */}
        <div className="space-y-3 mb-4 fade-in-1">
          {participants.map(p => (
            <ParticipantRow
              key={p.id}
              participant={p}
              customRoles={customRoles}
              onUpdate={updated => updateParticipant(p.id, updated)}
              onRemove={() => removeParticipant(p.id)}
              onCustomRoleAdded={role => setCustomRoles(prev => [...prev, role])}
            />
          ))}
        </div>

        {errors.participants && (
          <p className="text-xs text-red-500 mb-3">{errors.participants}</p>
        )}

        <button
          type="button"
          onClick={addParticipant}
          className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium mb-10 fade-in-2"
        >
          <Plus size={14} />
          Add participant
        </button>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Goal section */}
        <div className="mb-10 fade-in-3">
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            What did you want from this meeting?
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Be specific — this shapes every part of your coaching.
          </p>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {GOAL_SUGGESTIONS.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setGoal(suggestion)
                  if (errors.goal) setErrors(prev => ({ ...prev, goal: '' }))
                }}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                  goal === suggestion
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <Input
            placeholder="Or describe your goal in your own words…"
            value={goal}
            onChange={e => {
              setGoal(e.target.value)
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
            {isGenerating ? 'Generating coaching…' : 'Generate Coaching'}
            {!isGenerating && <ArrowRight size={16} />}
          </Button>
        </div>
      </main>
    </div>
  )
}
