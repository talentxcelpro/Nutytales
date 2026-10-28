-- ==============================================================================
-- NUTY TALES SELLER CENTRAL — MULTI-VENDOR COMMERCE PLATFORM SCHEMA (IDEMPOTENT)
-- Supabase Project: qezkjbzmtfjjmqgzgili
-- Central backend for nutytales.com, crafts.nutytales.com, gifting.nutytales.com,
-- weddings.nutytales.com, stays.nutytales.com, travel.nutytales.com, etc.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SELLERS TABLE (The vendor legal entity)
CREATE TABLE IF NOT EXISTS public.sellers (
  id TEXT PRIMARY KEY DEFAULT ('SLR-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  store_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  legal_name TEXT NOT NULL,
  business_type TEXT NOT NULL, -- 'farmer', 'artisan', 'packaged_food', 'wholesaler', 'gifting', 'hospitality_travel'
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  website TEXT,
  
  -- Address & Pickup Warehouse
  pickup_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  
  -- Tax & Legal Identifiers
  pan_number TEXT,
  gstin TEXT,
  fssai_number TEXT,
  gi_certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Bank Details (For direct NEFT/RTGS payouts)
  bank_name TEXT,
  bank_account_masked TEXT,
  bank_ifsc TEXT,
  bank_beneficiary TEXT,
  
  -- Commercial Terms & Status
  status TEXT NOT NULL DEFAULT 'pending_review', -- 'draft', 'submitted', 'under_verification', 'approved', 'rejected', 'suspended'
  approved_categories TEXT[] DEFAULT ARRAY['dry_fruits']::TEXT[],
  approved_storefronts TEXT[] DEFAULT ARRAY['nutytales.com']::TEXT[],
  default_commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 8.00, -- e.g. 8.00%
  settlement_hold_days INTEGER NOT NULL DEFAULT 7,
  rejection_reason TEXT,
  verification_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by TEXT
);

-- 2. SELLER TEAM MEMBERS (Multi-user seller permissions)
CREATE TABLE IF NOT EXISTS public.seller_members (
  id TEXT PRIMARY KEY DEFAULT ('SMEM-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'manager', -- 'owner', 'manager', 'operations', 'finance'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'invited', 'suspended'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SELLER COMPLIANCE DOCUMENTS
CREATE TABLE IF NOT EXISTS public.seller_documents (
  id TEXT PRIMARY KEY DEFAULT ('SDOC-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- 'pan', 'gstin', 'fssai', 'bank_cheque', 'gi_cert', 'id_proof', 'other'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  rejection_reason TEXT,
  verified_at TIMESTAMPTZ,
  verified_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SELLER PRODUCTS (Catalogue listed by vendors)
CREATE TABLE IF NOT EXISTS public.seller_products (
  id TEXT PRIMARY KEY DEFAULT ('SPROD-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL, -- 'dry_fruits', 'crafts', 'gifting', 'packaged_foods', 'weddings', 'stays'
  subcategory TEXT,
  brand TEXT,
  description TEXT,
  images JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{ url: string, is_primary: boolean, alt?: string }]
  
  -- Specifications & Packaging
  pack_sizes JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{ name: "250g", sku: "...", mrp: 450, price: 399, stock: 50 }]
  weight_grams INTEGER NOT NULL DEFAULT 500,
  dimensions_cm JSONB DEFAULT '{"length": 15, "width": 10, "height": 5}'::JSONB,
  
  -- Taxation & Pricing
  hsn_code TEXT,
  gst_percent NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
  mrp NUMERIC(10, 2) NOT NULL,
  selling_price NUMERIC(10, 2) NOT NULL,
  wholesale_price NUMERIC(10, 2),
  
  -- Inventory
  stock_available INTEGER NOT NULL DEFAULT 0,
  stock_reserved INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER NOT NULL DEFAULT 10,
  
  -- Lifecycle & Moderation
  status TEXT NOT NULL DEFAULT 'pending_review', -- 'draft', 'pending_review', 'approved', 'rejected', 'archived'
  rejection_reason TEXT,
  
  -- Regulatory Declarations
  fssai_info JSONB, -- { license_number, expiry_date, ingredients, nutrition_per_100g, allergen_warnings }
  craft_info JSONB, -- { artisan_guild, gi_tag_number, material, provenance }
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SELLER INVENTORY MOVEMENTS (Strict stock audit ledger)
CREATE TABLE IF NOT EXISTS public.seller_stock_movements (
  id TEXT PRIMARY KEY DEFAULT ('SMOV-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.seller_products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  change_qty INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  movement_type TEXT NOT NULL, -- 'manual_adjustment', 'order_reservation', 'order_cancelled_release', 'order_fulfilled', 'damaged_loss', 'restock'
  reference_id TEXT, -- Order ID or Batch Ref
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SELLER FULFILMENT ORDERS (Vendor-isolated order splits)
CREATE TABLE IF NOT EXISTS public.seller_orders (
  id TEXT PRIMARY KEY DEFAULT ('SO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  parent_order_id TEXT,
  parent_order_number TEXT NOT NULL,
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  
  -- Customer Delivery (Sanitized for seller)
  customer_name TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_state TEXT NOT NULL,
  customer_pincode TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  customer_phone_masked TEXT,
  
  -- Items payload
  items JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{ product_id, sku, title, variant, qty, unit_price, total_price, gst_percent }]
  items_count INTEGER NOT NULL DEFAULT 1,
  
  -- Financials
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_charged NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  commission_rate NUMERIC(5, 2) NOT NULL,
  commission_amount NUMERIC(10, 2) NOT NULL,
  gst_on_commission NUMERIC(10, 2) NOT NULL,
  tds_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  net_payout NUMERIC(10, 2) NOT NULL,
  
  -- Status & Logistics Lifecycle
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'accepted', 'processing', 'packed', 'ready_for_pickup', 'shipped', 'delivered', 'cancellation_requested', 'cancelled', 'return_requested', 'returned', 'disputed'
  cancellation_reason TEXT,
  
  -- Carrier info
  carrier_name TEXT,
  tracking_number TEXT,
  awb_code TEXT,
  label_url TEXT,
  pickup_scheduled_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Settlement tracking
  payout_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'on_hold', 'settled', 'refunded'
  payout_id TEXT,
  settlement_eligible_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. SELLER FINANCIAL LEDGER (Immutable double-entry balance log)
CREATE TABLE IF NOT EXISTS public.seller_ledger_entries (
  id TEXT PRIMARY KEY DEFAULT ('SLED-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  seller_order_id TEXT REFERENCES public.seller_orders(id) ON DELETE SET NULL,
  entry_type TEXT NOT NULL, -- 'order_credit', 'commission_debit', 'shipping_debit', 'tax_debit', 'refund_debit', 'payout_settled', 'adjustment'
  amount NUMERIC(10, 2) NOT NULL, -- positive for credits, negative for debits
  balance_after NUMERIC(12, 2) NOT NULL,
  description TEXT NOT NULL,
  reference_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. SELLER PAYOUT BATCHES
CREATE TABLE IF NOT EXISTS public.seller_payout_batches (
  id TEXT PRIMARY KEY DEFAULT ('PAY-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'processing', 'completed', 'failed'
  bank_ref_utr TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  processed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SELLER PROMOTIONS
CREATE TABLE IF NOT EXISTS public.seller_promotions (
  id TEXT PRIMARY KEY DEFAULT ('SPRM-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  promo_type TEXT NOT NULL DEFAULT 'percentage_discount', -- 'percentage_discount', 'flat_discount', 'bulk_discount'
  discount_value NUMERIC(6, 2) NOT NULL,
  min_order_value NUMERIC(10, 2) DEFAULT 0.00,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  funded_by TEXT NOT NULL DEFAULT 'seller', -- 'seller', 'platform'
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SELLER SUPPORT TICKETS & DISPUTES
CREATE TABLE IF NOT EXISTS public.seller_support_tickets (
  id TEXT PRIMARY KEY DEFAULT ('STCK-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  seller_id TEXT NOT NULL REFERENCES public.sellers(id) ON DELETE CASCADE,
  order_id TEXT REFERENCES public.seller_orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'order_fulfilment', -- 'order_fulfilment', 'payout', 'product_approval', 'compliance', 'shipping', 'other'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'closed'
  messages JSONB NOT NULL DEFAULT '[]'::JSONB, -- [{ sender: 'seller'|'admin', sender_name: string, text: string, sent_at: string, attachments?: string[] }]
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================
-- INDEXES & PERFORMANCE
-- ==============================================================
CREATE INDEX IF NOT EXISTS idx_sellers_user_id ON public.sellers(user_id);
CREATE INDEX IF NOT EXISTS idx_sellers_status ON public.sellers(status);
CREATE INDEX IF NOT EXISTS idx_sellers_slug ON public.sellers(slug);

CREATE INDEX IF NOT EXISTS idx_seller_products_seller_id ON public.seller_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_products_status ON public.seller_products(status);
CREATE INDEX IF NOT EXISTS idx_seller_products_category ON public.seller_products(category);

CREATE INDEX IF NOT EXISTS idx_seller_orders_seller_id ON public.seller_orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_orders_status ON public.seller_orders(status);
CREATE INDEX IF NOT EXISTS idx_seller_orders_payout_status ON public.seller_orders(payout_status);

CREATE INDEX IF NOT EXISTS idx_seller_ledger_seller_id ON public.seller_ledger_entries(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_payouts_seller_id ON public.seller_payout_batches(seller_id);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_payout_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_support_tickets ENABLE ROW LEVEL SECURITY;

-- Service role bypasses all policies
DROP POLICY IF EXISTS "sellers_service_all" ON public.sellers;
CREATE POLICY "sellers_service_all" ON public.sellers FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_members_service_all" ON public.seller_members;
CREATE POLICY "seller_members_service_all" ON public.seller_members FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_docs_service_all" ON public.seller_documents;
CREATE POLICY "seller_docs_service_all" ON public.seller_documents FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_products_service_all" ON public.seller_products;
CREATE POLICY "seller_products_service_all" ON public.seller_products FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_movements_service_all" ON public.seller_stock_movements;
CREATE POLICY "seller_movements_service_all" ON public.seller_stock_movements FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_orders_service_all" ON public.seller_orders;
CREATE POLICY "seller_orders_service_all" ON public.seller_orders FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_ledger_service_all" ON public.seller_ledger_entries;
CREATE POLICY "seller_ledger_service_all" ON public.seller_ledger_entries FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_payouts_service_all" ON public.seller_payout_batches;
CREATE POLICY "seller_payouts_service_all" ON public.seller_payout_batches FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_promos_service_all" ON public.seller_promotions;
CREATE POLICY "seller_promos_service_all" ON public.seller_promotions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "seller_tickets_service_all" ON public.seller_support_tickets;
CREATE POLICY "seller_tickets_service_all" ON public.seller_support_tickets FOR ALL TO service_role USING (true) WITH CHECK (true);
