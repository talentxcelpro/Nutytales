-- ==============================================================================
-- NUTY TALES — WHATSAPP COMMERCE OS DATABASE SCHEMA (IDEMPOTENT)
-- Supabase Project: qezkjbzmtfjjmqgzgili
-- Module: Enterprise WhatsApp Commerce Automation, Unified Inbox & AI Assistant
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WHATSAPP PROVIDER CONFIGURATION
-- Holds credentials and configuration settings for Meta WhatsApp Business Platform
CREATE TABLE IF NOT EXISTS public.whatsapp_provider_config (
  id TEXT PRIMARY KEY DEFAULT 'primary_meta_config',
  provider TEXT NOT NULL DEFAULT 'meta_cloud_api', -- 'meta_cloud_api', 'mock_sandbox', 'baileys_experimental'
  phone_number_id TEXT,
  waba_id TEXT, -- WhatsApp Business Account ID
  business_phone TEXT NOT NULL DEFAULT '+919717161809',
  access_token_masked TEXT,
  app_secret_masked TEXT,
  webhook_verify_token TEXT,
  api_version TEXT NOT NULL DEFAULT 'v21.0',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  mock_mode BOOLEAN NOT NULL DEFAULT FALSE,
  rate_limit_per_second INTEGER NOT NULL DEFAULT 25,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WHATSAPP CONTACTS (Unified Customer Directory)
CREATE TABLE IF NOT EXISTS public.whatsapp_contacts (
  id TEXT PRIMARY KEY DEFAULT ('WAC-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  phone_number TEXT UNIQUE NOT NULL, -- Standardized E.164 without spaces/dashes (e.g. +919717161809)
  formatted_phone TEXT,
  name TEXT NOT NULL DEFAULT 'Valued Customer',
  email TEXT,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  source TEXT NOT NULL DEFAULT 'website_checkout', -- 'website_checkout', 'inbound_chat', 'bulk_quote', 'wedding_enquiry', 'lead_form'
  segment TEXT NOT NULL DEFAULT 'new_customer', -- 'new_customer', 'first_time_buyer', 'repeat_customer', 'high_value', 'inactive', 'abandoned_checkout', 'wedding_gifting', 'wholesale'
  preferred_language TEXT NOT NULL DEFAULT 'en', -- 'en', 'hi'
  
  -- Commerce Telemetry & Lifetime Value
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spend NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  last_order_id TEXT,
  last_order_at TIMESTAMPTZ,
  
  -- Consent & Compliance
  consent_status TEXT NOT NULL DEFAULT 'PENDING', -- 'OPTED_IN', 'OPTED_OUT', 'PENDING'
  consent_timestamp TIMESTAMPTZ,
  opt_out_timestamp TIMESTAMPTZ,
  
  -- CRM Context
  notes TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  first_interaction_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_interaction_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_phone ON public.whatsapp_contacts(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_segment ON public.whatsapp_contacts(segment);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_consent ON public.whatsapp_contacts(consent_status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_contacts_total_spend ON public.whatsapp_contacts(total_spend DESC);

-- 3. WHATSAPP CONVERSATIONS (Live Thread Sessions)
CREATE TABLE IF NOT EXISTS public.whatsapp_conversations (
  id TEXT PRIMARY KEY DEFAULT ('WACV-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'AI_ACTIVE', 'HUMAN_TAKEOVER', 'RESOLVED', 'ARCHIVED'
  priority TEXT NOT NULL DEFAULT 'NORMAL', -- 'LOW', 'NORMAL', 'HIGH', 'URGENT'
  assigned_to TEXT, -- User ID or Staff Name
  unread_count INTEGER NOT NULL DEFAULT 0,
  last_message_preview TEXT,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  labels TEXT[] DEFAULT ARRAY[]::TEXT[],
  internal_notes TEXT,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_contact ON public.whatsapp_conversations(contact_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_status ON public.whatsapp_conversations(status);
CREATE INDEX IF NOT EXISTS idx_whatsapp_conversations_last_msg ON public.whatsapp_conversations(last_message_at DESC);

-- 4. WHATSAPP MESSAGES (Chat Ledger)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id TEXT PRIMARY KEY DEFAULT ('WAM-' || LPAD(FLOOR(RANDOM() * 10000000)::TEXT, 7, '0')),
  conversation_id TEXT NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  meta_message_id TEXT UNIQUE, -- Meta WAMID (e.g. wamid.HBgLM...)
  direction TEXT NOT NULL, -- 'INBOUND', 'OUTBOUND'
  sender_type TEXT NOT NULL, -- 'CUSTOMER', 'AI', 'AGENT', 'SYSTEM'
  sender_name TEXT,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'template', 'image', 'document', 'interactive'
  body TEXT NOT NULL,
  template_name TEXT,
  template_params JSONB DEFAULT '{}'::JSONB,
  media_url TEXT,
  media_type TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'
  error_code TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_conversation ON public.whatsapp_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_meta_id ON public.whatsapp_messages(meta_message_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_sent_at ON public.whatsapp_messages(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_status ON public.whatsapp_messages(delivery_status);

-- 5. WHATSAPP MESSAGE TEMPLATES (Approved Meta Templates)
CREATE TABLE IF NOT EXISTS public.whatsapp_message_templates (
  id TEXT PRIMARY KEY DEFAULT ('TMPL-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  name TEXT UNIQUE NOT NULL, -- e.g. 'order_confirmation_v1', 'payment_success_v1'
  display_title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'UTILITY', 'MARKETING', 'AUTHENTICATION'
  language TEXT NOT NULL DEFAULT 'en', -- 'en', 'hi'
  status TEXT NOT NULL DEFAULT 'APPROVED', -- 'APPROVED', 'PENDING', 'REJECTED', 'PAUSED'
  header_type TEXT DEFAULT 'TEXT', -- 'NONE', 'TEXT', 'IMAGE', 'DOCUMENT'
  header_content TEXT,
  body_text TEXT NOT NULL,
  footer_text TEXT,
  buttons JSONB DEFAULT '[]'::JSONB, -- [{type: 'QUICK_REPLY', text: 'Track Order'}, ...]
  variable_mapping JSONB DEFAULT '[]'::JSONB, -- ['customer_name', 'order_id', 'amount']
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. WHATSAPP MESSAGE EVENTS (Delivery Lifecycle Audit)
CREATE TABLE IF NOT EXISTS public.whatsapp_message_events (
  id TEXT PRIMARY KEY DEFAULT ('EVT-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  message_id TEXT NOT NULL REFERENCES public.whatsapp_messages(id) ON DELETE CASCADE,
  meta_message_id TEXT,
  event_type TEXT NOT NULL, -- 'sent', 'delivered', 'read', 'failed'
  error_details JSONB,
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  raw_payload JSONB DEFAULT '{}'::JSONB
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_events_message ON public.whatsapp_message_events(message_id);

-- 7. WHATSAPP CONSENT RECORDS (Regulatory Compliance Audit Log)
CREATE TABLE IF NOT EXISTS public.whatsapp_consent_records (
  id TEXT PRIMARY KEY DEFAULT ('CNS-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  consent_type TEXT NOT NULL, -- 'OPT_IN', 'OPT_OUT'
  source TEXT NOT NULL, -- 'checkout_checkbox', 'chat_keyword', 'admin_override', 'privacy_portal'
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_consent_phone ON public.whatsapp_consent_records(phone_number);

-- 8. WHATSAPP AUTOMATION RULES (Commerce Event Triggers)
CREATE TABLE IF NOT EXISTS public.whatsapp_automation_rules (
  id TEXT PRIMARY KEY DEFAULT ('RULE-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0')),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL, -- 'ORDER_CONFIRMED', 'PAYMENT_CAPTURED', 'ORDER_DISPATCHED', 'ORDER_DELIVERED', 'CART_ABANDONED', 'REPEAT_PURCHASE_NUDGE'
  template_name TEXT NOT NULL,
  delay_minutes INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  conditions JSONB DEFAULT '{}'::JSONB, -- e.g. { "min_order_amount": 500 }
  cooldown_hours INTEGER NOT NULL DEFAULT 24, -- Prevent repetitive spam
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. WHATSAPP AUTOMATION EXECUTIONS (Idempotency Ledger)
CREATE TABLE IF NOT EXISTS public.whatsapp_automation_executions (
  id TEXT PRIMARY KEY DEFAULT ('EXEC-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  rule_id TEXT REFERENCES public.whatsapp_automation_rules(id) ON DELETE SET NULL,
  trigger_event TEXT NOT NULL,
  entity_id TEXT NOT NULL, -- order_id or cart_session_id
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  idempotency_key TEXT UNIQUE NOT NULL, -- e.g. 'ORDER_CONFIRMED_NT-ORD-2026-102938'
  status TEXT NOT NULL DEFAULT 'EXECUTED', -- 'PENDING', 'EXECUTED', 'SKIPPED_NO_CONSENT', 'SKIPPED_ALREADY_PURCHASED', 'FAILED'
  message_id TEXT REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  execution_details JSONB DEFAULT '{}'::JSONB,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_exec_idempotency ON public.whatsapp_automation_executions(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_whatsapp_exec_entity ON public.whatsapp_automation_executions(entity_id);

-- 10. WHATSAPP CAMPAIGNS (Broadcast Manager)
CREATE TABLE IF NOT EXISTS public.whatsapp_campaigns (
  id TEXT PRIMARY KEY DEFAULT ('CMP-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'seasonal_promotion', 'dry_fruits_nuts', 'kashmiri_products', 'wedding_hampers', 'corporate_gifting', 'repeat_purchase'
  target_segment TEXT NOT NULL, -- 'all_opted_in', 'first_time_buyers', 'repeat_customers', 'high_value', 'abandoned_checkout'
  template_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'PAUSED', 'CANCELLED'
  scheduled_for TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Metrics
  audience_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  converted_count INTEGER NOT NULL DEFAULT 0,
  total_revenue_attributed NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  estimated_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. WHATSAPP CAMPAIGN RECIPIENTS (Recipient Delivery Tracking)
CREATE TABLE IF NOT EXISTS public.whatsapp_campaign_recipients (
  id TEXT PRIMARY KEY DEFAULT ('RCP-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  campaign_id TEXT NOT NULL REFERENCES public.whatsapp_campaigns(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  message_id TEXT REFERENCES public.whatsapp_messages(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'OPTED_OUT'
  error_reason TEXT,
  sent_at TIMESTAMPTZ,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  order_id TEXT,
  revenue_amount NUMERIC(10, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_recipients_campaign ON public.whatsapp_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_recipients_contact ON public.whatsapp_campaign_recipients(contact_id);

-- 12. WHATSAPP WEBHOOK EVENTS (Strict Deduplication Ledger)
CREATE TABLE IF NOT EXISTS public.whatsapp_webhook_events (
  id TEXT PRIMARY KEY DEFAULT ('WBH-' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')),
  event_id TEXT UNIQUE NOT NULL, -- Meta notification event ID or message WAMID
  provider TEXT NOT NULL DEFAULT 'meta_cloud_api',
  event_type TEXT NOT NULL, -- 'messages', 'message_status', 'billing_event'
  raw_payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT TRUE,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_whatsapp_webhook_event_id ON public.whatsapp_webhook_events(event_id);

-- 13. WHATSAPP SUPPORT ASSIGNMENTS (Staff Handover Log)
CREATE TABLE IF NOT EXISTS public.whatsapp_support_assignments (
  id TEXT PRIMARY KEY DEFAULT ('ASG-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  conversation_id TEXT NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  assigned_to_user_id TEXT,
  assigned_to_name TEXT NOT NULL,
  assigned_by TEXT NOT NULL DEFAULT 'SYSTEM',
  handover_reason TEXT,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. WHATSAPP AI SESSIONS (Shopping Assistant Context)
CREATE TABLE IF NOT EXISTS public.whatsapp_ai_sessions (
  id TEXT PRIMARY KEY DEFAULT ('AIS-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0')),
  conversation_id TEXT UNIQUE NOT NULL REFERENCES public.whatsapp_conversations(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES public.whatsapp_contacts(id) ON DELETE CASCADE,
  context_window JSONB DEFAULT '[]'::JSONB, -- [{role: 'user', content: '...'}, {role: 'assistant', content: '...'}]
  detected_intent TEXT, -- 'product_enquiry', 'order_status', 'wedding_hamper', 'bulk_rfq', 'complaint'
  language TEXT NOT NULL DEFAULT 'en', -- 'en', 'hi'
  turn_count INTEGER NOT NULL DEFAULT 0,
  escalated_to_human BOOLEAN NOT NULL DEFAULT FALSE,
  last_interaction_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. ROW-LEVEL SECURITY & PERMISSION POLICIES
ALTER TABLE public.whatsapp_provider_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_message_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_support_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_ai_sessions ENABLE ROW LEVEL SECURITY;

-- 16. SERVICE ROLE BYPASS POLICIES (Backend API Full Access)
DROP POLICY IF EXISTS "whatsapp_provider_config_service_role" ON public.whatsapp_provider_config;
CREATE POLICY "whatsapp_provider_config_service_role" ON public.whatsapp_provider_config FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_contacts_service_role" ON public.whatsapp_contacts;
CREATE POLICY "whatsapp_contacts_service_role" ON public.whatsapp_contacts FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_conversations_service_role" ON public.whatsapp_conversations;
CREATE POLICY "whatsapp_conversations_service_role" ON public.whatsapp_conversations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_messages_service_role" ON public.whatsapp_messages;
CREATE POLICY "whatsapp_messages_service_role" ON public.whatsapp_messages FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_templates_service_role" ON public.whatsapp_message_templates;
CREATE POLICY "whatsapp_templates_service_role" ON public.whatsapp_message_templates FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_events_service_role" ON public.whatsapp_message_events;
CREATE POLICY "whatsapp_events_service_role" ON public.whatsapp_message_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_consent_service_role" ON public.whatsapp_consent_records;
CREATE POLICY "whatsapp_consent_service_role" ON public.whatsapp_consent_records FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_rules_service_role" ON public.whatsapp_automation_rules;
CREATE POLICY "whatsapp_rules_service_role" ON public.whatsapp_automation_rules FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_executions_service_role" ON public.whatsapp_automation_executions;
CREATE POLICY "whatsapp_executions_service_role" ON public.whatsapp_automation_executions FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_campaigns_service_role" ON public.whatsapp_campaigns;
CREATE POLICY "whatsapp_campaigns_service_role" ON public.whatsapp_campaigns FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_recipients_service_role" ON public.whatsapp_campaign_recipients;
CREATE POLICY "whatsapp_recipients_service_role" ON public.whatsapp_campaign_recipients FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_webhooks_service_role" ON public.whatsapp_webhook_events;
CREATE POLICY "whatsapp_webhooks_service_role" ON public.whatsapp_webhook_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_assignments_service_role" ON public.whatsapp_support_assignments;
CREATE POLICY "whatsapp_assignments_service_role" ON public.whatsapp_support_assignments FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "whatsapp_ai_sessions_service_role" ON public.whatsapp_ai_sessions;
CREATE POLICY "whatsapp_ai_sessions_service_role" ON public.whatsapp_ai_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 17. SEED DEFAULT TEMPLATES & AUTOMATION RULES (Idempotent ON CONFLICT DO NOTHING)
INSERT INTO public.whatsapp_message_templates (name, display_title, category, language, body_text, buttons)
VALUES 
  ('order_confirmation_v1', 'Order Confirmation', 'UTILITY', 'en', 
   'Hello {{1}}! 🥜 Your Nuty Tales order #{{2}} of ₹{{3}} has been confirmed and is being packed with care. You can track your shipment anytime.', 
   '[{"type": "URL", "text": "Track Order", "url": "https://nutytales.com/orders/track?id={{2}}"}]'::JSONB),
  
  ('payment_received_v1', 'Payment Received', 'UTILITY', 'en',
   'Payment Confirmed! 💳 We received ₹{{1}} for order #{{2}} via Razorpay. Your receipt has been generated. Thank you for choosing Nuty Tales.',
   '[{"type": "QUICK_REPLY", "text": "View Receipt"}]'::JSONB),
   
  ('order_dispatched_v1', 'Order Dispatched', 'UTILITY', 'en',
   'Your dry fruits are on the way! 🚚 Order #{{1}} has been handed over to {{2}} (AWB: {{3}}). Estimated delivery in 2-3 business days.',
   '[{"type": "URL", "text": "Track Delivery", "url": "{{4}}"}]'::JSONB),
   
  ('delivery_feedback_v1', 'Delivery & Review', 'UTILITY', 'en',
   'Delivered! 📦 Your Nuty Tales package for order #{{1}} has been delivered. We hope you love the crispness and quality. How was your experience?',
   '[{"type": "QUICK_REPLY", "text": "⭐ 5 Stars - Loved it!"}, {"type": "QUICK_REPLY", "text": "Need Help"}]'::JSONB),
   
  ('abandoned_cart_v1', 'Cart Reminder', 'MARKETING', 'en',
   'Hello {{1}}, you left some premium {{2}} in your Nuty Tales basket! 🛒 Complete your order today and use code NUTY10 for 10% off. Shipped fresh with nitrogen-sealed packs.',
   '[{"type": "URL", "text": "Complete Order", "url": "https://nutytales.com/checkout?ref=wa_cart"}]'::JSONB),
   
  ('repeat_purchase_v1', 'Restock Reminder', 'MARKETING', 'en',
   'Hello {{1}}! Time to restock your favourite {{2}}? 🌿 Fresh harvest batches of Jumbo Makhana and California Almonds are now in stock with special member pricing.',
   '[{"type": "URL", "text": "Reorder Now", "url": "https://nutytales.com/shop"}]'::JSONB)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.whatsapp_automation_rules (name, trigger_event, template_name, delay_minutes, is_active)
VALUES 
  ('Instant Order Confirmation', 'ORDER_CONFIRMED', 'order_confirmation_v1', 0, true),
  ('Payment Capture Notification', 'PAYMENT_CAPTURED', 'payment_received_v1', 0, true),
  ('Dispatch Tracking Notification', 'ORDER_DISPATCHED', 'order_dispatched_v1', 0, true),
  ('Post-Delivery Review Request', 'ORDER_DELIVERED', 'delivery_feedback_v1', 120, true),
  ('Abandoned Cart Recovery (1 Hour)', 'CART_ABANDONED', 'abandoned_cart_v1', 60, true),
  ('30-Day Restock Nudge', 'REPEAT_PURCHASE_NUDGE', 'repeat_purchase_v1', 43200, true)
ON CONFLICT DO NOTHING;
