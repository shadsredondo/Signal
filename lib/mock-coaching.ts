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

  const firstHighStakeholder = highImportanceParticipants[0]?.name || 'the key stakeholder'

  return {
    summary: {
      strengths: [
        'Strong opener — you established why this conversation mattered before diving into the detail',
        `Cited business impact early, which aligned the room before debate started`,
        'Kept the conversation moving and prevented it from stalling on process questions',
      ],
      moves: [
        `Send ${firstHighStakeholder} a 3-bullet follow-up anchoring the decision and your ask — within 24 hours`,
        'Close every next meeting with a specific ask: "Can we agree to X by [date]?"',
        'Replace "I think we should" with "I recommend" — same idea, 3x more authority',
      ],
    },
    goalScore: {
      color: 'yellow',
      label: 'Partial progress toward your goal',
      rationale: `You made meaningful progress on "${userGoal}" — your framing was strong early and you kept the conversation moving. However, key objections from ${highImportanceParticipants[0]?.name || 'senior stakeholders'} were left unresolved, and you missed an opportunity to close with a clear decision or next step. Yellow signals real momentum with a few targeted adjustments needed.`,
    },
    strategicCommunication: {
      themes: [
        {
          title: 'Framing and context-setting',
          whatHappened: `You opened by establishing why the conversation mattered, but stopped short of stating the business impact directly.`,
          howItLanded: `Participants had to fill in their own interpretation of why this decision was urgent — leaving room for misalignment before the debate even started.`,
          whatToDoBetter: `Lead with one crisp impact sentence before any detail: "This decision affects Q3 revenue by ~15%." It forces alignment and raises the stakes for everyone in the room.`,
        },
        {
          title: 'Objection handling',
          whatHappened: `When ${firstHighStakeholder} raised concerns about timeline, you acknowledged it briefly and moved on.`,
          howItLanded: `The quick pivot read as avoidance rather than confidence. It may have left the objection unresolved in their mind — and in the room's.`,
          whatToDoBetter: `Use the acknowledge-answer-redirect pattern: name the concern explicitly, give a 1-2 sentence answer, then redirect. Don't move on until you see a nod.`,
        },
        {
          title: 'Audience tailoring',
          whatHappened: `You delivered the same message and framing to everyone in the room, regardless of their role or priorities.`,
          howItLanded: `Engineering was looking for feasibility signals. Finance wanted ROI. Neither got what they needed to feel confident — making your ask harder to approve.`,
          whatToDoBetter: `Before your next meeting, write one sentence per stakeholder: "For [Name], the most important signal is ___." Use it to vary emphasis in real time.`,
        },
        {
          title: 'Closing with momentum',
          whatHappened: `The meeting ended without a named decision, owner, or next step.`,
          howItLanded: `Ambiguity benefits opponents of your proposal — it gives them time to reframe the outcome in 1:1s before you can follow up.`,
          whatToDoBetter: `Always close with a specific ask: "Can we agree to X by [date], with [Name] as the decision-maker?" A provisional yes is far stronger than an open door.`,
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
