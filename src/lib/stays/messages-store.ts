// ─── Nuty Tales Stays — In-App Host/Butler Messaging Store ──────────────────
// Direct real-time messaging between guests and verified estate hosts/butlers.
// Supports pre-arrival chips, dietary tags, transfer coordination, and WhatsApp fallback.

import { STAY_PROPERTIES, StayProperty } from '@/lib/stays-data'

export interface StayHostMessage {
  id: string
  threadId: string
  sender: 'guest' | 'host' | 'concierge'
  senderName: string
  message: string
  timestamp: string
  preArrivalTags?: string[]
}

export interface StayHostThread {
  id: string
  propertySlug: string
  propertyName: string
  guestName: string
  guestPhone: string
  hostName: string
  hostAvatar: string
  hostSuperhost: boolean
  hostResponseTime: string
  lastMessage: string
  lastUpdated: string
  messages: StayHostMessage[]
}

const THREADS_STORE: StayHostThread[] = [
  // Seed demo conversation for Harwan Royal Walnut Orchard Estate
  {
    id: 'thread-demo-harwan',
    propertySlug: 'harwan-orchard-estate',
    propertyName: 'The Harwan Royal Walnut Orchard Estate',
    guestName: 'Dr. Sanjeev Kapoor',
    guestPhone: '+91 98111 22334',
    hostName: 'Arshid Wani',
    hostAvatar: '/images/crafts-artisan-hands.jpg',
    hostSuperhost: true,
    hostResponseTime: 'within 5 minutes',
    lastMessage: 'The heritage Bukhari fireplace is being pre-warmed for your arrival.',
    lastUpdated: new Date().toISOString(),
    messages: [
      {
        id: 'msg-01',
        threadId: 'thread-demo-harwan',
        sender: 'host',
        senderName: 'Arshid Wani (Host & Estate Custodian)',
        message: 'Salaam Dr. Kapoor! Welcome to Nuty Tales Stays. My private estate team and I are at your complete service. Please let me know your expected arrival time and any dietary preferences for the welcome Kashmiri Kahwa ceremony.',
        timestamp: '2026-10-22T10:00:00.000Z',
      },
      {
        id: 'msg-02',
        threadId: 'thread-demo-harwan',
        sender: 'guest',
        senderName: 'Dr. Sanjeev Kapoor',
        message: 'Hello Arshid, looking forward to our stay. We will arrive around 3 PM. Could we request low-sugar walnut Kahwa and ensure heating is on in the Chinar Suite?',
        timestamp: '2026-10-22T10:15:00.000Z',
        preArrivalTags: ['Fireplace Pre-Warm', 'Dietary: Low-Sugar Kahwa', 'Arrival 3:00 PM'],
      },
      {
        id: 'msg-03',
        threadId: 'thread-demo-harwan',
        sender: 'host',
        senderName: 'Arshid Wani (Host & Estate Custodian)',
        message: 'Consider it done. The heritage Bukhari fireplace is being pre-warmed for your arrival, and pure saffron Kahwa with crushed Mamra almonds will be ready in the garden lounge upon your arrival.',
        timestamp: '2026-10-22T10:18:00.000Z',
      },
    ],
  },
]

/**
 * Retrieves or creates a messaging thread for a property and guest.
 */
export function getOrCreateThread(
  propertySlug: string,
  guestName: string,
  guestPhone: string,
): StayHostThread {
  const property = STAY_PROPERTIES.find((p) => p.slug === propertySlug) || STAY_PROPERTIES[0]
  const cleanPhone = guestPhone.replace(/\D/g, '')

  let thread = THREADS_STORE.find(
    (t) => t.propertySlug === propertySlug && t.guestPhone.replace(/\D/g, '') === cleanPhone,
  )

  if (!thread) {
    const threadId = `thread-${propertySlug}-${Date.now()}`
    thread = {
      id: threadId,
      propertySlug,
      propertyName: property.name,
      guestName: guestName || 'Guest',
      guestPhone,
      hostName: property.host.name,
      hostAvatar: property.host.avatar,
      hostSuperhost: property.host.superhost,
      hostResponseTime: property.host.responseTime,
      lastMessage: `Connected with ${property.host.name}`,
      lastUpdated: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          threadId,
          sender: 'host',
          senderName: `${property.host.name} (Host)`,
          message: `Greetings! I am ${property.host.name}, host of ${property.name}. How can we personalize your upcoming stay? Feel free to ask about transfers, chef menus, or early check-in.`,
          timestamp: new Date().toISOString(),
        },
      ],
    }
    THREADS_STORE.unshift(thread)
  }

  return thread
}

/**
 * Sends a message in a thread and generates intelligent host/butler acknowledgment.
 */
export function postHostMessage(input: {
  propertySlug: string
  guestName: string
  guestPhone: string
  message: string
  preArrivalTags?: string[]
}): { thread: StayHostThread; newGuestMessage: StayHostMessage; automatedReply?: StayHostMessage } {
  const thread = getOrCreateThread(input.propertySlug, input.guestName, input.guestPhone)
  const property = STAY_PROPERTIES.find((p) => p.slug === input.propertySlug) || STAY_PROPERTIES[0]

  const guestMsg: StayHostMessage = {
    id: `msg-g-${Date.now()}`,
    threadId: thread.id,
    sender: 'guest',
    senderName: input.guestName || 'You',
    message: input.message,
    timestamp: new Date().toISOString(),
    preArrivalTags: input.preArrivalTags,
  }

  thread.messages.push(guestMsg)
  thread.lastMessage = input.message
  thread.lastUpdated = guestMsg.timestamp

  // Generate context-aware host butler reply
  let replyText = `Thank you for sharing, ${input.guestName.split(' ')[0]}! I have received your request and briefed our on-site residence butler. We will coordinate this seamlessly before your check-in.`

  if (input.preArrivalTags && input.preArrivalTags.length > 0) {
    const tagsStr = input.preArrivalTags.join(', ')
    if (tagsStr.includes('4x4') || tagsStr.includes('Transfer') || tagsStr.includes('Airport')) {
      replyText = `Noted on the transfer requirements (${tagsStr}). Our dedicated chauffeur will monitor your arrival details and reach out with the vehicle plate number and live GPS link prior to pickup.`
    } else if (tagsStr.includes('Dietary') || tagsStr.includes('Vegetarian') || tagsStr.includes('Jain')) {
      replyText = `Understood regarding your dietary preferences (${tagsStr}). Our in-house chef has marked this in the kitchen briefing sheet and will curate separate gourmet dining for you.`
    } else if (tagsStr.includes('Check-in') || tagsStr.includes('Early')) {
      replyText = `We have registered your early check-in request (${tagsStr}). We will prioritize suite housekeeping right after morning departure to accommodate you smoothly.`
    } else if (tagsStr.includes('Fireplace') || tagsStr.includes('Bukhari') || tagsStr.includes('Heater')) {
      replyText = `We will ensure the wood fireplace / Bukhari is seasoned and glowing prior to your arrival so your chamber is wonderfully warm.`
    }
  }

  const hostReply: StayHostMessage = {
    id: `msg-h-${Date.now() + 1}`,
    threadId: thread.id,
    sender: 'host',
    senderName: `${property.host.name} (Estate Host)`,
    message: replyText,
    timestamp: new Date(Date.now() + 1000).toISOString(),
  }

  thread.messages.push(hostReply)
  thread.lastMessage = replyText
  thread.lastUpdated = hostReply.timestamp

  return {
    thread,
    newGuestMessage: guestMsg,
    automatedReply: hostReply,
  }
}
