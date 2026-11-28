-- 009_order_management_system.sql
-- NutyTales Order Management, Fulfillment, Shipment Tracking & Audit System
-- Backward-compatible migration with strict RLS policies.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id TEXT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL DEFAULT '',
  customer_phone TEXT NOT NULL DEFAULT '',
  billing_address JSONB NULL,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL DEFAULT 'razorpay',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  order_status TEXT NOT NULL DEFAULT 'pending',
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled',
  razorpay_order_id TEXT NULL,
  razorpay_payment_id TEXT NULL,
  notes TEXT NULL,
  coupon_code TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ NULL,
  cancelled_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL
);

CREATE INDEX IF NOT EXISTS idx_store_orders_order_number ON store_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_store_orders_user_id ON store_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_store_orders_customer_email ON store_orders(LOWER(customer_email));
CREATE INDEX IF NOT EXISTS idx_store_orders_customer_phone ON store_orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_store_orders_created_at ON store_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_order_status ON store_orders(order_status);
CREATE INDEX IF NOT EXISTS idx_store_orders_payment_status ON store_orders(payment_status);

-- 2. Order Items Table (Product Snapshots)
CREATE TABLE IF NOT EXISTS store_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_sku TEXT NOT NULL DEFAULT '',
  product_image TEXT NOT NULL DEFAULT '',
  product_variant TEXT NOT NULL DEFAULT '',
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_order_items_order_id ON store_order_items(order_id);

-- 3. Shipments Table (Supports Split Shipments)
CREATE TABLE IF NOT EXISTS store_shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  courier_name TEXT NOT NULL,
  courier_slug TEXT NOT NULL DEFAULT 'manual',
  tracking_number TEXT NOT NULL DEFAULT '',
  tracking_url TEXT NOT NULL DEFAULT '',
  shipment_status TEXT NOT NULL DEFAULT 'label_created',
  shipping_method TEXT NOT NULL DEFAULT 'express_air',
  estimated_delivery TIMESTAMPTZ NULL,
  shipped_at TIMESTAMPTZ NULL,
  delivered_at TIMESTAMPTZ NULL,
  shipping_notes TEXT NULL,
  provider_reference TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_shipments_order_id ON store_shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_store_shipments_tracking_number ON store_shipments(tracking_number);

-- 4. Order Tracking Events
CREATE TABLE IF NOT EXISTS order_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  shipment_id UUID NULL REFERENCES store_shipments(id) ON DELETE SET NULL,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL DEFAULT 'system',
  is_customer_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_tracking_events_order_id ON order_tracking_events(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_shipment_id ON order_tracking_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_events_timestamp ON order_tracking_events(event_timestamp ASC);

-- 5. Order Notifications
CREATE TABLE IF NOT EXISTS order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  customer_id TEXT NULL,
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  recipient TEXT NOT NULL,
  notification_status TEXT NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ NULL,
  error_message TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_notifications_order_id ON order_notifications(order_id);

-- 6. Admin Audit Logs
CREATE TABLE IF NOT EXISTS order_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES store_orders(id) ON DELETE CASCADE,
  actor_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value JSONB NULL,
  new_value JSONB NULL,
  metadata JSONB NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_audit_logs_order_id ON order_audit_logs(order_id);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_audit_logs ENABLE ROW LEVEL SECURITY;

-- Authenticated users can only SELECT their own orders
DROP POLICY IF EXISTS "Users can view own orders" ON store_orders;
CREATE POLICY "Users can view own orders"
  ON store_orders FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own order items" ON store_order_items;
CREATE POLICY "Users can view own order items"
  ON store_order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM store_orders o
      WHERE o.id = store_order_items.order_id
        AND o.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can view own shipments" ON store_shipments;
CREATE POLICY "Users can view own shipments"
  ON store_shipments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM store_orders o
      WHERE o.id = store_shipments.order_id
        AND o.user_id = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can view own visible tracking events" ON order_tracking_events;
CREATE POLICY "Users can view own visible tracking events"
  ON order_tracking_events FOR SELECT
  TO authenticated
  USING (
    is_customer_visible = TRUE
    AND EXISTS (
      SELECT 1 FROM store_orders o
      WHERE o.id = order_tracking_events.order_id
        AND o.user_id = auth.uid()::text
    )
  );
