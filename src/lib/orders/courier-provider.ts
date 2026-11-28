import type { ShipmentStatus } from './types'

export interface CreateShipmentInput {
  orderId: string
  orderNumber: string
  courierName: string
  courierSlug?: string
  trackingNumber?: string
  trackingUrl?: string
  shippingMethod?: string
  estimatedDelivery?: string | null
  shippingNotes?: string | null
}

export interface ShipmentProviderResult {
  success: boolean
  trackingNumber?: string
  trackingUrl?: string
  providerReference?: string
  labelUrl?: string
  error?: string
}

export interface TrackingWebhookEvent {
  trackingNumber: string
  status: ShipmentStatus
  title: string
  description: string
  location?: string
  eventTimestamp: string
  providerReference?: string
}

export interface ShipmentProvider {
  readonly slug: string
  readonly name: string
  createShipment(input: CreateShipmentInput): Promise<ShipmentProviderResult>
  generateLabel?(shipmentId: string): Promise<{ labelUrl?: string; error?: string }>
  retrieveTracking?(trackingNumber: string): Promise<TrackingWebhookEvent[]>
  cancelShipment?(shipmentId: string): Promise<{ success: boolean; error?: string }>
  parseWebhookEvent?(payload: unknown, signature?: string): Promise<TrackingWebhookEvent | null>
}

export class ManualCourierProvider implements ShipmentProvider {
  readonly slug = 'manual'
  readonly name = 'Manual Courier Dispatch'

  async createShipment(input: CreateShipmentInput): Promise<ShipmentProviderResult> {
    return {
      success: true,
      trackingNumber: input.trackingNumber || '',
      trackingUrl: input.trackingUrl || '',
      providerReference: `manual:${input.orderNumber}:${Date.now()}`,
    }
  }
}

export function getShipmentProvider(slug = 'manual'): ShipmentProvider {
  // Future providers (e.g. Shiprocket, Delhivery) plug in here without changing order core.
  switch (slug) {
    case 'manual':
    default:
      return new ManualCourierProvider()
  }
}
