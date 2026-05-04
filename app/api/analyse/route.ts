import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/system-prompt'
import type { Participant } from '@/types'
import type { UserProfile } from '@/lib/profile'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      transcript,
      userGoal,
      userTitle,
      userSeniority,
      meetingTitle,
      participants,
      profile,
    }: {
      transcript: string
      userGoal: string
      userTitle: string
      userSeniority: string
      meetingTitle: string
      participants: Participant[]
      profile: UserProfile | null
    } = body

    if (!transcript?.trim()) {
      return NextResponse.json({ error: 'Transcript is required and cannot be empty' }, { status: 400 })
    }
    if (!userGoal?.trim()) {
      return NextResponse.json({ error: 'Meeting goal is required' }, { status: 400 })
    }
    if (!Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json({ error: 'At least one participant is required' }, { status: 400 })
    }

    const userParticipant = participants.find(p => p.isUser)
    const otherParticipants = participants.filter(p => !p.isUser)

    const participantList = [
      userParticipant
        ? `- ${userParticipant.name} (YOU) — ${userParticipant.role || userTitle}`
        : null,
      ...otherParticipants.map(p => `- ${p.name}${p.role ? ` — ${p.role}` : ''}`),
    ].filter(Boolean).join('\n')

    const profileSection = profile
      ? [
          `Name: ${profile.name}`,
          `Role: ${profile.role || userTitle}`,
          `Seniority: ${profile.seniority || userSeniority}`,
          profile.companyName ? `Company: ${profile.companyName}${profile.companySize ? ` (${profile.companySize})` : ''}` : null,
          profile.communicationChallenge ? `Communication challenge: ${profile.communicationChallenge}` : null,
          profile.goal ? `Career goal: ${profile.goal}` : null,
        ].filter(Boolean).join('\n')
      : `Role: ${userTitle}\nSeniority: ${userSeniority}`

    const userMessage = `## Meeting transcript
${transcript}

## Meeting context
Title: ${meetingTitle}
Goal: ${userGoal}

## Participants
${participantList}

## Your profile
${profileSection}`

    if (!userMessage.trim()) {
      return NextResponse.json({ error: 'Message content is empty — check your inputs' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 8192,
      system: SYSTEM_PROMPT || undefined,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = response.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      return NextResponse.json({ error: 'No response from model' }, { status: 500 })
    }

    let coaching
    try {
      coaching = JSON.parse(textBlock.text)
    } catch {
      console.error('Failed to parse model response:', textBlock.text.slice(0, 500))
      return NextResponse.json({ error: 'Failed to parse coaching output' }, { status: 500 })
    }

    return NextResponse.json(coaching)
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'Invalid API key — check your .env.local file' }, { status: 401 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'Rate limited — please wait a moment and try again' }, { status: 429 })
    }
    if (error instanceof Anthropic.BadRequestError) {
      console.error('Bad request to Anthropic API:', error.message)
      return NextResponse.json({ error: `Invalid request: ${error.message}` }, { status: 400 })
    }
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed — please try again' }, { status: 500 })
  }
}
