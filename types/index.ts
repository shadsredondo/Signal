export type GoalScore = 'red' | 'yellow' | 'green'
export type Importance = 'high' | 'medium' | 'low'
export type TranscriptFormat = 'zoom' | 'raw'
export type Alignment = 'aligned' | 'resistant' | 'neutral' | 'political'

export interface Participant {
  id: string
  name: string
  role: string
  importance: Importance
  isUser: boolean
}

export interface DraftSession {
  transcript: string
  transcriptFormat: TranscriptFormat
  detectedParticipants: string[]
  userTitle: string
  userFunction: string
  userSeniority: string
  meetingTitle?: string
}

export interface Session {
  id: string
  createdAt: string
  transcript: string
  transcriptFormat: TranscriptFormat
  userGoal: string
  userTitle: string
  userFunction: string
  userSeniority: string
  meetingTitle: string
  participants: Participant[]
  coachingOutput: CoachingOutput
  goalScore: GoalScore
}

export interface CoachingOutput {
  summary: {
    strengths: string[]
    moves: string[]
  }
  goalScore: {
    color: GoalScore
    label: string
    rationale: string
  }
  strategicCommunication: {
    themes: Array<{
      title: string
      observation: string
      recommendation: string
    }>
  }
  toneAndPresence: {
    overall: {
      summary: string
      patterns: string[]
      recommendations: string[]
    }
    perParticipant: Array<{
      participantName: string
      howYouCameAcross: string
      recommendations: string[]
    }>
  }
  clarity: {
    styleOverall: string
    examples: Array<{
      original: string
      rewrite: string
      note: string
    }>
  }
  stakeholderSignals: Array<{
    participantName: string
    role: string
    signals: string[]
    hiddenConcern?: string
    alignment: Alignment
  }>
  nextActions: {
    stakeholderSpecific: Array<{
      stakeholder: string
      action: string
      timing: string
    }>
    general: string[]
  }
}
