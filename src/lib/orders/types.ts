export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'partially_refunded'
  | 'refunded'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded'

export type FulfillmentStatus =
  | 'unfulfilled'
  | 'partially_fulfilled'
  | 'fulfilled'
  | 'delivered'

export type ShipmentStatus =
  | 'label_created'
  | 'picked_up'
  | 'in_transit'
  | 'at_sorting_hub'
  | 'arrived_at_destination_hub'
  | 'out_for_delivery'
  | 'delivered'
  | 'delivery_failed'
  | 'returned_to_sender'
  | 'exception'

export const ALLOWED_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'processing', 'cancelled'],
  confirmed: ['processing', 'packed', 'cancelled'],
  processing: ['packed', 'ready_to_ship', 'cancelled'],
  packed: ['ready_to_ship', 'shipped', 'cancelled'],
  ready_to_ship: ['shipped', 'cancelled'],
  shipped: ['delivered', 'return_requested'],
  delivered: ['return_requested'],
  cancelled: ['refunded'],
  return_requested: ['returned', 'delivered'],
  returned: ['refunded'],
  refunded: [],
}

export function canTransitionOrderStatus(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return true
  return (ALLOWED_ORDER_TRANSITIONS[from] || []).includes(to)
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const rand = Math.floor(100000 + Math.random() * 900000)
  return `NT-${year}-${rand}`
}
