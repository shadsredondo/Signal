import { TranscriptFormat } from '@/types'

const NON_SPEAKER_TOKENS = new Set([
  // Meeting metadata labels
  'meeting title', 'attendees', 'attendee', 'date', 'time', 'location',
  'duration', 'host', 'note', 'notes', 'subject', 'topic', 'agenda',
  'summary', 'action items', 'action item', 're', 'from', 'to', 'cc',
  'recorded by', 'transcribed by', 'zoom meeting',
  // Additional Zoom/Teams/Meet headers
  'recording', 'transcript', 'participants', 'start time', 'end time',
  'meeting id', 'passcode', 'password', 'organizer', 'facilitator',
  'presenter', 'moderator', 'co-host', 'panelist', 'scribe', 'chair',
  'written by', 'prepared by', 'created by', 'minute taker', 'notetaker',
  'title', 'description', 'purpose', 'objective', 'objectives', 'goals',
  'outcomes', 'decisions', 'next steps', 'follow up', 'follow-up',
  'references', 'attachments', 'link', 'url', 'email', 'phone',
  'invited', 'invitees', 'optional', 'required', 'organiser',
  'meeting notes', 'call notes', 'call summary', 'meeting summary',
  'sent', 'sent from', 'forwarded', 'original message',
])

function isNonSpeaker(name: string): boolean {
  const lower = name.toLowerCase()
  if (NON_SPEAKER_TOKENS.has(lower)) return true
  // Reject if name contains digits (timestamps, IDs) or URLs
  if (/\d/.test(name)) return true
  // Reject if name contains URL-like patterns
  if (/https?:|www\.|@/.test(name)) return true
  return false
}

export function detectFormat(text: string): TranscriptFormat {
  // Zoom VTT format has WEBVTT header or timestamp patterns like 00:00:01.000 --> 00:00:05.000
  if (text.includes('WEBVTT') || /\d{2}:\d{2}:\d{2}\.\d{3}\s+-->\s+\d{2}:\d{2}:\d{2}\.\d{3}/.test(text)) {
    return 'zoom'
  }
  return 'raw'
}

export function extractSpeakers(text: string, format: TranscriptFormat): string[] {
  const speakers = new Set<string>()

  if (format === 'zoom') {
    // Zoom VTT: speaker name appears before colon after timestamp block
    // Pattern 1: "Speaker Name: text" on lines after timestamps
    const zoomLinePattern = /^([A-Z][^:\n]{1,40}):\s+\S/gm
    let match
    while ((match = zoomLinePattern.exec(text)) !== null) {
      const name = match[1].trim()
      // Filter out timestamp lines and common non-name patterns
      if (!name.includes('-->') && !name.match(/^\d/) && name.length > 1 && !isNonSpeaker(name)) {
        speakers.add(name)
      }
    }

    // Pattern 2: Zoom format "Name (HH:MM:SS): text"
    const zoomTimestampPattern = /^([A-Z][^(:\n]{1,40})\s*\(\d{2}:\d{2}:\d{2}\):/gm
    while ((match = zoomTimestampPattern.exec(text)) !== null) {
      speakers.add(match[1].trim())
    }
  } else {
    // Raw format: "Name: text" at start of line
    const rawPattern = /^([A-Z][^:\n]{0,40}):\s+\S/gm
    let match
    while ((match = rawPattern.exec(text)) !== null) {
      const name = match[1].trim()
      if (name.length > 1 && name.length < 40 && !isNonSpeaker(name)) {
        speakers.add(name)
      }
    }

    // Also handle plain-text Zoom exports: "Name (HH:MM:SS): text"
    const plainZoomPattern = /^([A-Z][^(:\n]{1,40})\s*\(\d{1,2}:\d{2}(?::\d{2})?\):/gm
    while ((match = plainZoomPattern.exec(text)) !== null) {
      const name = match[1].trim()
      if (name.length > 1 && !isNonSpeaker(name)) {
        speakers.add(name)
      }
    }
  }

  return Array.from(speakers).filter(s => s.length > 0)
}

export function parseTranscript(text: string): { format: TranscriptFormat; speakers: string[] } {
  const format = detectFormat(text)
  const speakers = extractSpeakers(text, format)
  return { format, speakers }
}
