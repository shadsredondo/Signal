export type GoalScore = 'red' | 'yellow' | 'green'
export type Importance = 'high' | 'medium' | 'low'
export type TranscriptFormat = 'zoom' | 'raw'

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
  participants: Participant[]
  userTitle: string
  userGoal: string
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

export interface CoachingSection {
  id: 'strategic_communication' | 'tone_and_presence' | 'clarity'
  one_line_summary: string
  what_went_well: Array<{ point: string; evidence: string }>
  what_could_be_stronger: Array<{ point: string; evidence: string }>
  rewrite_suggestions?: Array<{ original: string; rewrite: string; why: string }>
}

export interface CoachingOutput {
  goal_outcome: 'strong' | 'partial' | 'off_track'
  overall_summary: {
    headline: string
    what_landed: string[]
    next_moves: string[]
  }
  sections: CoachingSection[]
  next_steps: Array<{ action: string; timing: string }>
}
