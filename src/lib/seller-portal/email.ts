// ─── Nuty Tales Seller Central — Transactional Email Service ─────────────────
// Connects Resend API for merchant lifecycle notifications:
// Registration, verification, order fulfilment, and payout events.

interface EmailPayload {
  to: string
  subject: string
  html: string
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Nuty Tales Seller Central <orders@nuttytales.com>'

export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY || RESEND_API_KEY.includes('xxxx')) {
    console.log('[Email:DevLog] Resend API key not configured or sandbox mock. Notification logged:', {
      to: payload.to,
      subject: payload.subject,
    })
    return { success: true, id: `dev-email-${Date.now()}` }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      console.warn('[Email] Resend API rejected message:', errData)
      return { success: false, error: errData.message || 'Resend API error' }
    }

    const data = await res.json()
    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('[Email] Network error dispatching email via Resend:', err)
    return { success: false, error: err.message }
  }
}

export async function sendSellerRegistrationReceivedEmail(seller: {
  storeName: string
  email: string
  id: string
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #163326;">
      <h2 style="color: #163326; margin-bottom: 8px;">Application Received: Nuty Tales Seller Central</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${seller.storeName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6;">Your merchant application (Ref: <code>${seller.id}</code>) has been submitted for compliance verification. Our operations team reviews all business tax identifiers, identity records, and catalogue suitability.</p>
      <p style="font-size: 14px; line-height: 1.6;">You can log into <a href="https://seller.nutytales.com" style="color: #C5A869; font-weight: bold;">Seller Central</a> at any time to monitor your approval status.</p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">Nuty Tales Global Marketplace · Central Operations Desk</p>
    </div>
  `
  return sendEmail({
    to: seller.email,
    subject: `Application Received: ${seller.storeName} (${seller.id})`,
    html,
  })
}

export async function sendSellerStatusChangedEmail(seller: {
  storeName: string
  email: string
  id: string
  status: string
  rejectionReason?: string
  verificationNotes?: string
}) {
  const isApproved = seller.status === 'approved'
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #163326;">
      <h2 style="color: #163326; margin-bottom: 8px;">Seller Account Update: ${isApproved ? 'Approved' : 'Status Changed'}</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${seller.storeName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6;">Your merchant account status has been updated to: <strong style="text-transform: uppercase;">${seller.status}</strong>.</p>
      ${seller.verificationNotes ? `<p style="font-size: 13px; color: #4B5563; background: #FAF6EF; padding: 12px; border-radius: 6px;">${seller.verificationNotes}</p>` : ''}
      ${seller.rejectionReason ? `<p style="font-size: 13px; color: #DC2626; background: #FEE2E2; padding: 12px; border-radius: 6px;">Reason: ${seller.rejectionReason}</p>` : ''}
      ${isApproved ? `<p style="font-size: 14px; line-height: 1.6;">You may now create products, manage inventory, and receive international orders.</p>` : ''}
      <p style="margin-top: 20px;"><a href="https://seller.nutytales.com" style="background: #163326; color: #FAF6EF; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Go to Seller Central</a></p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">Nuty Tales Global Marketplace · Merchant Compliance Desk</p>
    </div>
  `
  return sendEmail({
    to: seller.email,
    subject: `Merchant Status Update: ${seller.storeName} (${seller.status.toUpperCase()})`,
    html,
  })
}

export async function sendNewOrderNotificationEmail(seller: {
  storeName: string
  email: string
}, order: {
  id: string
  parentOrderNumber: string
  itemsCount: number
  subtotal: number
  currency: string
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #163326;">
      <h2 style="color: #163326; margin-bottom: 8px;">New Order Received for Dispatch!</h2>
      <p style="font-size: 15px; line-height: 1.6;">Hello <strong>${seller.storeName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6;">You have received a new customer order requiring fulfilment:</p>
      <ul style="font-size: 14px; line-height: 1.8;">
        <li>Fulfilment Order ID: <code>${order.id}</code></li>
        <li>Parent Order Ref: <code>${order.parentOrderNumber}</code></li>
        <li>Total Items: <strong>${order.itemsCount}</strong></li>
        <li>Subtotal: <strong>${order.currency} ${order.subtotal.toFixed(2)}</strong></li>
      </ul>
      <p style="font-size: 14px; line-height: 1.6;">Please pack the items and book courier pickup on your orders dashboard to maintain your dispatch SLA.</p>
      <p style="margin-top: 20px;"><a href="https://seller.nutytales.com/orders" style="background: #163326; color: #FAF6EF; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">View Fulfilment Order</a></p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="font-size: 12px; color: #6B7280;">Nuty Tales Global Fulfilment Network</p>
    </div>
  `
  return sendEmail({
    to: seller.email,
    subject: `New Fulfilment Order: ${order.id} (${order.currency} ${order.subtotal.toFixed(2)})`,
    html,
  })
}
