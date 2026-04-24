import { CoachingOutput, Participant } from '@/types'

export function generateMockCoaching(
  userGoal: string,
  participants: Participant[],
  userTitle: string
): CoachingOutput {
  const highImportanceParticipants = participants.filter(
    p => !p.isUser && p.importance === 'high'
  )
  const userParticipant = participants.find(p => p.isUser)
  const userName = userParticipant?.name || 'You'

  return {
    goalScore: {
      color: 'yellow',
      label: 'Partial progress toward your goal',
      rationale: `You made meaningful progress on "${userGoal}" — your framing was strong early and you kept the conversation moving. However, key objections from ${highImportanceParticipants[0]?.name || 'senior stakeholders'} were left unresolved, and you missed an opportunity to close with a clear decision or next step. Yellow signals real momentum with a few targeted adjustments needed.`,
    },
    strategicCommunication: {
      themes: [
        {
          title: 'Framing and context-setting',
          observation: `You opened with strong context — you established why this conversation mattered. The business impact was implicit but not stated directly, which left some participants to fill in their own interpretation.`,
          recommendation: `Lead with the business impact before the detail. One sentence: "This decision affects Q3 revenue by approximately 15%." That forces alignment before debate starts.`,
        },
        {
          title: 'Objection handling',
          observation: `When ${highImportanceParticipants[0]?.name || 'the finance stakeholder'} raised concerns about timeline, you acknowledged it but pivoted too quickly. It may have read as avoidance rather than confidence.`,
          recommendation: `Use the acknowledge-answer-redirect pattern: name the concern explicitly, give a crisp 1-2 sentence answer, then redirect to your core point. Don't move on until you see a nod.`,
        },
        {
          title: 'Audience tailoring',
          observation: `Your message was consistent across all participants, but the room had different priorities. Engineering wanted feasibility signals. Finance wanted ROI. You gave everyone the same frame.`,
          recommendation: `Before your next meeting, write one sentence per stakeholder: "For [Name], the most important signal is ___." Use that to vary your emphasis in real time.`,
        },
        {
          title: 'Closing with momentum',
          observation: `The meeting ended without a clear decision or owner. This creates ambiguity and gives opponents of your proposal time to reframe the outcome offline.`,
          recommendation: `Always close with a specific ask: "Can we agree to X by [date], with [Name] as the decision-maker?" Even a provisional yes is stronger than an open door.`,
        },
      ],
    },
    toneAndPresence: {
      overall: {
        summary: `Your tone was generally professional and engaged. You showed preparation and genuine conviction. However, there were moments of over-explanation under pressure that may have unintentionally signaled uncertainty to senior stakeholders.`,
        patterns: [
          'Filler phrases detected: "I think," "kind of," "sort of" — used 8+ times',
          'Hedging language: "we might want to consider" instead of direct recommendations',
          'Pacing slowed noticeably when challenged — a signal of defensiveness',
          'Strong opener: confident, well-paced, authority established early',
        ],
        recommendations: [
          'Replace "I think we should" with "I recommend." It reads as 3x more confident with no added risk.',
          'When challenged, pause for one beat before responding. Silence signals composure, not uncertainty.',
          'Cut filler words by writing your 3 key points before the meeting and anchoring back to them when you feel pressure.',
        ],
      },
      perParticipant: highImportanceParticipants.slice(0, 3).map((p, i) => ({
        participantName: p.name,
        howYouCameAcross: [
          `${p.name} likely perceived you as prepared and thoughtful, but may have wanted more decisiveness. Your answers were complete but occasionally over-qualified, which can read as uncertainty at the ${p.role} level.`,
          `To ${p.name}, you came across as knowledgeable but tentative. The ${p.role} track typically responds to confidence and brevity — they want the bottom line first, details second.`,
          `${p.name} appeared engaged when you spoke directly to their domain. However, you missed two moments where they were signaling readiness to align and you moved past without locking it in.`,
        ][i % 3],
        recommendations: [
          `Mirror ${p.name}'s communication style — they favor direct, evidence-led statements. Match their energy.`,
          `Acknowledge ${p.name}'s constraints explicitly next time: "I know this affects your team's bandwidth — here's how I've accounted for that."`,
        ],
      })),
    },
    clarity: {
      styleOverall: `Your communication is structured and logical, which is a real strength. The main opportunity is sharpness — several answers ran 20-30% longer than needed. Senior audiences scan for the signal; extra words dilute it.`,
      examples: [
        {
          original: `"So I think what we're trying to do here, and this is something we've been thinking about for a while, is kind of explore whether we can maybe move forward on this initiative in Q3."`,
          rewrite: `"We're proposing to move this initiative to Q3. Here's why now makes sense."`,
          note: 'Lead with the recommendation, follow with the rationale. Never bury the ask.',
        },
        {
          original: `"There's some data that suggests activation might be dropping, and it might be worth looking into."`,
          rewrite: `"Activation dropped 22% in onboarding last quarter. I recommend we prioritize step 2 of the flow."`,
          note: 'Specific numbers + clear recommendation = instant credibility.',
        },
        {
          original: `"I think there are a few different ways we could potentially approach this problem."`,
          rewrite: `"There are three options. I recommend option two. Here's the tradeoff."`,
          note: 'Name the options, state your recommendation, then explain — not the reverse.',
        },
      ],
    },
    stakeholderSignals: highImportanceParticipants.slice(0, 4).map((p, i) => ({
      participantName: p.name,
      role: p.role,
      alignment: (['resistant', 'neutral', 'aligned', 'political'] as const)[i % 4],
      signals: [
        [
          'Asked for more proof on timeline estimates — classic resistance signal',
          'Reframed your proposal twice in their own language',
          'Silence after your key ask — likely processing, but could signal doubt',
        ],
        [
          'Nodded when you cited the business impact',
          'Asked a clarifying question, not a challenging one — sign of engagement',
          'Body language open; leaned in when you mentioned user research',
        ],
        [
          'Verbally agreed with your framing early',
          'Built on your point when speaking — strong alignment signal',
          'Made eye contact with the decision-maker after your key ask',
        ],
        [
          'Silent during key moments — watching the room, not engaging with your content',
          'Asked a question that redirected attention to a peer, not you',
          'May have a competing priority that wasn\'t surfaced in this meeting',
        ],
      ][i % 4],
      hiddenConcern: [
        `${p.name} may be concerned about resource impact on their team. This wasn't stated but the pattern of questions suggests it.`,
        undefined,
        undefined,
        `${p.name}'s silence may indicate a separate conversation is happening at the leadership level. Worth a 1:1 before the next meeting.`,
      ][i % 4],
    })),
    nextActions: {
      stakeholderSpecific: [
        ...highImportanceParticipants.slice(0, 2).map(p => ({
          stakeholder: p.name,
          action: p.importance === 'high'
            ? `Send a 3-bullet follow-up email anchoring the key decision, your recommendation, and the one open question. Keep it under 100 words.`
            : `Schedule a 15-minute 1:1 to address the objection they raised about timeline before this goes to a broader decision.`,
          timing: 'Within 24 hours',
        })),
        {
          stakeholder: highImportanceParticipants[0]?.name || 'Decision Maker',
          action: 'Request a direct yes/no on the proposal — give them a binary choice with a clear default if they don\'t respond.',
          timing: 'Before end of week',
        },
      ],
      general: [
        'Write a one-page summary of the meeting outcome and share it with all attendees — this lets you control the narrative of what was decided.',
        'Identify the one unresolved objection that has the most risk of derailing approval. Address it head-on in your next touchpoint.',
        `For your next meeting, prepare a 30-second version of your ask. Practice saying it without filler words. This is your anchor when the conversation drifts.`,
      ],
    },
  }
}
