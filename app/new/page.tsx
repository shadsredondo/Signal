'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { saveDraft } from '@/lib/storage'
import { parseTranscript } from '@/lib/transcript-parser'

const TRANSCRIPT_PLACEHOLDER = `Sarah: Good morning everyone. Thanks for joining the roadmap review.\n\nMark: Morning. I wanted to raise a concern about the Q3 timeline before we get started...\n\nYou: Absolutely, let's address that first. I've actually prepared some data on that.`

export default function NewMeetingPage() {
  const router = useRouter()
  const [transcript, setTranscript] = useState('')
  const [meetingTitle, setMeetingTitle] = useState('')
  const [userTitle, setUserTitle] = useState('')
  const [userFunction, setUserFunction] = useState('')
  const [userSeniority, setUserSeniority] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!transcript.trim()) e.transcript = 'Please add your transcript or notes.'
    if (!userTitle.trim()) e.userTitle = 'Your title helps us personalize coaching.'
    return e
  }

  function handleContinue() {
    const e = validate()
    if (Object.keys(e).length > 0) {
      setErrors(e)
      return
    }

    const { format, speakers } = parseTranscript(transcript)

    saveDraft({
      transcript: transcript.trim(),
      transcriptFormat: format,
      detectedParticipants: speakers,
      userTitle: userTitle.trim(),
      userFunction: userFunction.trim(),
      userSeniority: userSeniority.trim(),
      meetingTitle: meetingTitle.trim() || 'Untitled meeting',
    })

    router.push('/analyzing')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Bring in a conversation that mattered
          </h1>
          <p className="text-sm text-gray-500">
            The more context you share, the sharper your coaching.
          </p>
        </div>

        {/* Meeting title */}
        <div className="mb-5 fade-in-1">
          <Input
            label="Meeting title (optional)"
            placeholder="e.g. Q3 Roadmap Review with Finance"
            value={meetingTitle}
            onChange={e => setMeetingTitle(e.target.value)}
          />
        </div>

        {/* Transcript input */}
        <div className="mb-8 fade-in-2">
          <Textarea
            label="Transcript"
            placeholder={TRANSCRIPT_PLACEHOLDER}
            value={transcript}
            onChange={e => {
              setTranscript(e.target.value)
              if (errors.transcript) setErrors(prev => ({ ...prev, transcript: '' }))
            }}
            rows={12}
            error={errors.transcript}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8" />

        {/* Your context */}
        <div className="mb-8 fade-in-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Your context</h2>
          <p className="text-xs text-gray-500 mb-5">
            Helps us frame coaching from your perspective.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Your title"
              placeholder="e.g. Senior Product Manager"
              value={userTitle}
              onChange={e => {
                setUserTitle(e.target.value)
                if (errors.userTitle) setErrors(prev => ({ ...prev, userTitle: '' }))
              }}
              error={errors.userTitle}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Job function"
                placeholder="e.g. Product"
                value={userFunction}
                onChange={e => setUserFunction(e.target.value)}
              />
              <Input
                label="Seniority"
                placeholder="e.g. Mid-level, Senior, Director"
                value={userSeniority}
                onChange={e => setUserSeniority(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="fade-in-4">
          <Button
            size="lg"
            onClick={handleContinue}
            className="w-full flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={16} />
          </Button>
        </div>
      </main>
    </div>
  )
}
