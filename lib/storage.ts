import { Session, DraftSession } from '@/types'

const SESSIONS_KEY = 'signal_sessions'
const DRAFT_KEY = 'signal_draft'

export function getSessions(): Session[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]')
  } catch {
    return []
  }
}

export function getSession(id: string): Session | null {
  return getSessions().find(s => s.id === id) || null
}

export function saveSession(session: Session): void {
  const sessions = getSessions()
  const idx = sessions.findIndex(s => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.unshift(session)
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter(s => s.id !== id)
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

export function getDraft(): DraftSession | null {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
  } catch {
    return null
  }
}

export function saveDraft(data: DraftSession): void {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data))
}

export function clearDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY)
}
