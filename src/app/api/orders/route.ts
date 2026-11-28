import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSupabaseAdmin } from '@/lib/supabase'
import { syncConsumerOrderToSellers } from '@/lib/seller-portal/order-sync'
import { WhatsAppAutomationEngine } from '@/lib/whatsapp/automations'
import { recordOrderNotification } from '@/lib/orders/notifications'
import { verifyAdminToken } from '@/lib/auth/jwt-verifier'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('nt_uid')?.value
  const authResult = await verifyAdminToken(token)

  if (!authResult.payload?.uid) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return NextResponse.json({ success: false, error: 'Database unavailable' }, { status: 503 })
  }

  const { data: orders, error } = await supabase
    .from('store_orders')
    .select(
      'id, order_number, total_amount, currency, payment_method, payment_status, order_status, fulfillment_status, created_at, delivered_at'
    )
    .eq('user_id', authResult.payload.uid)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, orders: orders || [] })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      customer,
      items,
      total,
      paymentMethod = 'razorpay',
      vertical = 'retail',
      type = 'order',
      referenceId,
      notes,
    } = body

    const orderId =
      referenceId ||
      `NT-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

    // Synchronize multi-vendor order items to seller fulfilment orders
    let sellerOrders: any[] = []
    try {
      sellerOrders = await syncConsumerOrderToSellers({
        orderId,
        orderNumber: orderId,
        customer: customer || {},
        items: items || [],
        total: Number(total || 0),
        currency: 'INR',
        paymentMethod,
      })
    } catch (syncErr) {
      console.error('[Storefront Checkout] Failed to split seller orders:', syncErr)
    }

    const customerName = customer?.fullName || customer?.name || 'Customer'
    const phone = customer?.phone || ''
    const email = customer?.email || ''
    const city = customer?.city || 'PAN-India'
    const company = customer?.companyName || ''

    const supabaseAdmin = getSupabaseAdmin()
    if (supabaseAdmin) {
      // Persist canonical order record in store_orders + store_order_items + tracking event
      try {
        const cookieStore = await cookies()
        const authResult = await verifyAdminToken(cookieStore.get('nt_uid')?.value)
        const userId = authResult.payload?.uid || null
        const isPaid = Boolean(body?.razorpayPaymentId)

        const { data: insertedOrder } = await supabaseAdmin
          .from('store_orders')
          .insert({
            order_number: orderId,
            user_id: userId,
            customer_name: customerName,
            customer_email: email,
            customer_phone: phone,
            shipping_address: customer || {},
            subtotal: Number(body?.subtotal ?? total ?? 0),
            discount_amount: Number(body?.discountAmount ?? 0),
            shipping_amount: Number(body?.shippingAmount ?? 0),
            tax_amount: Number(body?.taxAmount ?? 0),
            total_amount: Number(total || 0),
            currency: 'INR',
            payment_method: paymentMethod,
            payment_status: isPaid ? 'paid' : 'pending',
            order_status: isPaid ? 'confirmed' : 'pending',
            fulfillment_status: 'unfulfilled',
            razorpay_order_id: body?.razorpayOrderId || null,
            razorpay_payment_id: body?.razorpayPaymentId || null,
            notes: notes || null,
            coupon_code: body?.couponCode || null,
            confirmed_at: isPaid ? new Date().toISOString() : null,
          })
          .select('id')
          .single()

        if (insertedOrder?.id) {
          if (Array.isArray(items) && items.length > 0) {
            await supabaseAdmin.from('store_order_items').insert(
              items.map((item: any) => ({
                order_id: insertedOrder.id,
                product_id: String(item.productId || item.id || 'unknown'),
                product_name: String(item.name || item.productName || 'Product'),
                product_sku: String(item.sku || ''),
                product_image: String(item.image || ''),
                product_variant: String(item.sizeLabel || item.variant || ''),
                quantity: Number(item.quantity || 1),
                unit_price: Number(item.unitPrice || item.price || 0),
                total_price: Number(item.totalPrice || item.price || 0),
              }))
            )
          }

          await supabaseAdmin.from('order_tracking_events').insert([
            {
              order_id: insertedOrder.id,
              status: 'pending',
              title: 'Order Placed',
              description: 'Your NutyTales order has been received.',
              source: 'system',
              is_customer_visible: true,
            },
            ...(isPaid
              ? [
                  {
                    order_id: insertedOrder.id,
                    status: 'confirmed',
                    title: 'Payment Confirmed',
                    description: 'Payment verified and order confirmed for dispatch.',
                    source: 'razorpay',
                    is_customer_visible: true,
                  },
                ]
              : []),
          ])

          if (email) {
            await recordOrderNotification({
              orderId: insertedOrder.id,
              customerId: userId,
              notificationType: isPaid ? 'payment_successful' : 'order_placed',
              channel: 'email',
              recipient: email,
            })
          }
        }
      } catch (orderErr) {
        console.warn('[Orders API] store_orders persistence error:', orderErr)
      }

      try {
        await supabaseAdmin.from('leads').insert({
          name: customerName,
          phone,
          email,
          business_name: company ? `[${vertical.toUpperCase()}] ${company}` : `[${vertical.toUpperCase()}]`,
          city,
          message: `[ORDER: ${orderId}] Total: ₹${total} | Payment: ${paymentMethod} | Type: ${type} | Items: ${JSON.stringify(items || [])} | SellerOrders: ${sellerOrders.map((so) => so.id).join(', ')} | Notes: ${notes || ''}`,
          source: `nutytales.com/${vertical}`,
        })
      } catch (err) {
        console.warn('[Orders API] Supabase lead insertion error:', err)
      }
    }

    // Trigger WhatsApp Commerce OS Order Confirmation (non-blocking)
    if (phone) {
      try {
        WhatsAppAutomationEngine.handleOrderConfirmation({
          orderId,
          orderNumber: orderId,
          customerName,
          customerPhone: phone,
          customerEmail: email,
          totalAmount: Number(total || 0),
          itemCount: Array.isArray(items) ? items.length : 1,
          shippingAddressCity: city,
        }).catch((waErr) => {
          console.warn('[Orders API] Non-blocking WhatsApp confirmation error:', waErr?.message)
        })
      } catch (waErr) {
        console.warn('[Orders API] WhatsApp confirmation dispatch failed:', waErr)
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      amount: total,
      paymentMethod,
      sellerOrdersCount: sellerOrders.length,
      message: 'Order recorded and synchronized with seller fulfillment desks.',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing order' },
      { status: 500 }
    )
  }
}
