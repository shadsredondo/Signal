import { TranscriptFormat } from '@/types'

const NON_SPEAKER_TOKENS = new Set([
  'meeting title', 'attendees', 'attendee', 'date', 'time', 'location',
  'duration', 'host', 'note', 'notes', 'subject', 'topic', 'agenda',
  'summary', 'action items', 'action item', 're', 'from', 'to', 'cc',
  'recorded by', 'transcribed by', 'zoom meeting',
])

function isNonSpeaker(name: string): boolean {
  return NON_SPEAKER_TOKENS.has(name.toLowerCase())
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
  }

  return Array.from(speakers).filter(s => s.length > 0)
}

export function parseTranscript(text: string): { format: TranscriptFormat; speakers: string[] } {
  const format = detectFormat(text)
  const speakers = extractSpeakers(text, format)
  return { format, speakers }
}
