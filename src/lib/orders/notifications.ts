import { getSupabaseAdmin } from '@/lib/supabase'

export type OrderNotificationType =
  | 'order_placed'
  | 'payment_successful'
  | 'order_confirmed'
  | 'order_processing'
  | 'order_packed'
  | 'order_shipped'
  | 'tracking_assigned'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refund_initiated'
  | 'refund_completed'

export interface QueueNotificationInput {
  orderId: string
  customerId?: string | null
  notificationType: OrderNotificationType
  channel?: 'email' | 'whatsapp'
  recipient: string
}

export async function recordOrderNotification(input: QueueNotificationInput) {
  const supabase = getSupabaseAdmin()
  if (!supabase || !input.recipient) return

  const isEmailConfigured = Boolean(process.env.RESEND_API_KEY || process.env.SMTP_HOST)
  const status =
    input.channel === 'email' && !isEmailConfigured ? 'unconfigured' : 'queued'

  try {
    await supabase.from('order_notifications').insert({
      order_id: input.orderId,
      customer_id: input.customerId || null,
      notification_type: input.notificationType,
      channel: input.channel || 'email',
      recipient: input.recipient,
      notification_status: status,
      error_message:
        status === 'unconfigured'
          ? 'Email provider not configured (RESEND_API_KEY / SMTP_HOST missing).'
          : null,
    })
  } catch (err) {
    console.warn('[OrderNotifications] Failed to record notification:', err)
  }
}
