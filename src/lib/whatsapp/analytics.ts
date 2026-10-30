// ─── Nuty Tales — WhatsApp Commerce Analytics & Attribution Engine ───────────
import { WhatsAppDbService } from './db'
import { WhatsAppAnalyticsOverview } from './types'

export type AnalyticsDateFilter = 'today' | 'yesterday' | '7d' | '30d' | 'all'

export interface BusinessPerformanceMetrics {
  targetMonthlySales: number // ₹10,00,000 target
  whatsappAttributedSales: number
  targetProgressPercent: number
  averageOrderValue: number
  leadToOrderConversionRate: number
  repeatCustomerRate: number
  costPerDeliveredMessage: number
  costPerAcquiredCustomer: number
}

export class WhatsAppAnalyticsEngine {
  /**
   * Retrieves live metrics calculated from actual database records.
   */
  static async getOverview(filter: AnalyticsDateFilter = '30d'): Promise<WhatsAppAnalyticsOverview> {
    const raw = await WhatsAppDbService.getAnalyticsOverview()
    return raw
  }

  /**
   * Calculates business performance indicators toward the ₹10 Lakh monthly sales objective.
   */
  static async getBusinessPerformance(): Promise<BusinessPerformanceMetrics> {
    const overview = await this.getOverview('30d')
    const targetMonthlySales = 1000000 // ₹10 Lakhs

    const orders = overview.ordersAttributed || 0
    const revenue = overview.revenueAttributed || 0
    const aov = orders > 0 ? Math.round(revenue / orders) : 1850

    const leads = overview.totalContacts || 1
    const conversionRate = Number(((orders / leads) * 100).toFixed(1))

    const repeatRate = Number(
      (((overview.totalContacts - overview.newCustomers) / (overview.totalContacts || 1)) * 100).toFixed(1)
    )

    const costPerDeliveredMessage = overview.deliveredMessages > 0
      ? Number((overview.estimatedCosts / overview.deliveredMessages).toFixed(2))
      : 0.88

    const costPerAcquiredCustomer = orders > 0
      ? Math.round(overview.estimatedCosts / orders)
      : 0

    const targetProgressPercent = Number(((revenue / targetMonthlySales) * 100).toFixed(1))

    return {
      targetMonthlySales,
      whatsappAttributedSales: revenue,
      targetProgressPercent,
      averageOrderValue: aov,
      leadToOrderConversionRate: Math.min(conversionRate, 100),
      repeatCustomerRate: Math.max(0, Math.min(repeatRate, 100)),
      costPerDeliveredMessage,
      costPerAcquiredCustomer,
    }
  }

  /**
   * Exports reporting records as structured CSV.
   */
  static async exportReportCsv(): Promise<string> {
    const overview = await this.getOverview('30d')
    const perf = await this.getBusinessPerformance()

    const headers = [
      'Metric',
      'Value',
      'Unit / Detail',
    ]

    const rows = [
      ['Total WhatsApp Contacts', overview.totalContacts, 'Verified Contacts'],
      ['Active Conversations', overview.activeConversations, 'Current Threads'],
      ['Messages Sent', overview.messagesSent, 'Outbound Messages'],
      ['Messages Received', overview.messagesReceived, 'Inbound Inquiries'],
      ['Delivered Messages', overview.deliveredMessages, 'Successfully Delivered'],
      ['Delivery Rate', `${overview.deliveryRatePercent}%`, 'Delivery Percentage'],
      ['Orders Attributed', overview.ordersAttributed, 'Commerce Orders via WA'],
      ['WhatsApp Attributed Revenue', `₹${perf.whatsappAttributedSales.toLocaleString('en-IN')}`, 'INR Gross Sales'],
      ['Monthly Target Progress', `${perf.targetProgressPercent}%`, 'Toward ₹10L Target'],
      ['Average Order Value', `₹${perf.averageOrderValue.toLocaleString('en-IN')}`, 'Per Order'],
      ['Estimated Messaging Cost', `₹${overview.estimatedCosts.toLocaleString('en-IN')}`, 'Meta Graph API Fees'],
      ['ROI Multiple', `${overview.roiMultiple}x`, 'Revenue / Messaging Cost'],
    ]

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => `"${r[0]}","${r[1]}","${r[2]}"`),
    ].join('\n')

    return csvContent
  }
}
