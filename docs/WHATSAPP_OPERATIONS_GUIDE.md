# NUTY TALES — WHATSAPP COMMERCE OS: DAILY OPERATIONS MANUAL
**Audience:** Customer Support Executives, Sales Concierge, E-Commerce Operations & Marketing Team  
**System Location:** `https://nutytales.com/admin/whatsapp`  
**Date:** 2026-10-30  
**Version:** 1.0.0

---

## 1. ACCESS & ROLE-BASED AUTHENTICATION

1. Open your browser and navigate to: `https://nutytales.com/admin/whatsapp`
2. If prompted, log in with your authorized Nuty Tales staff credentials. (Protected by server-side JWT session validation).
3. The dashboard opens with 5 main operational workspaces:
   - **Overview & ROI:** Business metrics, revenue progress toward ₹10 Lakh monthly target, and connectivity health.
   - **Live Inbox:** Real-time customer chat threads, AI auto-replies, and human agent takeover.
   - **Campaigns:** Seasonal promotional broadcasts, audience segmentation, and execution.
   - **Commerce Automations:** Active event triggers (Order, Payment, Dispatch, Cart Recovery).
   - **Provider Settings:** Meta WhatsApp Cloud API credentials and webhook verification.

---

## 2. MANAGING THE UNIFIED LIVE INBOX

The Live Inbox (`/admin/whatsapp?tab=inbox`) centralizes all customer conversations across India and international markets.

### 2.1 Inbox Layout
- **Left Thread List:** Lists all conversations sorted by latest message timestamp. Displays customer name, phone number, segment pill, unread message count, and status badge.
- **Top Filter Pills:** Filter by:
  - `ALL`: Complete customer history.
  - `OPEN`: Active threads.
  - `AI_ACTIVE`: Conversations currently being assisted by Nuty Tales AI.
  - `HUMAN_TAKEOVER`: Conversations where customer requested human assistance or lodged a complaint.
  - `RESOLVED`: Handled tickets.
- **Center Chat Pane:** Shows complete message timeline with timestamps, sender tags (`Customer`, `Nuty Tales AI Assistant`, `Support Concierge`), and delivery ticks (`✓ Sent`, `✓✓ Delivered`, `✓✓ Read`).
- **Bottom Composer:** Type text replies or copy approved template links.

### 2.2 Managing AI vs. Human Agent Handover
- **Automatic AI Response:** By default, new conversations start in `AI_ACTIVE` mode. The AI Shopping Assistant answers product queries (pricing of Jumbo Makhana, California Almonds, Kashmiri Saffron), pack sizes, delivery timelines, and order tracking links.
- **When to Take Over Manually:**
  1. A thread turns to `HUMAN_TAKEOVER` (indicated by a red badge) when the customer types *"agent"*, *"speak to human"*, or asks for a refund.
  2. Click on the thread.
  3. Review the customer's previous messages and profile (total orders placed, total spend).
  4. Type your personalized message in the composer and click **Send Message**.
  5. The conversation automatically switches to `HUMAN_TAKEOVER`, silencing AI auto-replies for that customer.
- **Handing Back to AI:**
  Once the inquiry is answered, click **Handover to AI Assistant 🤖** in the top action bar. The AI resumes answering future routine questions.
- **Resolving the Conversation:**
  Click **Mark Resolved ✓** when the interaction is concluded.

---

## 3. CREATING & EXECUTING CAMPAIGNS

Promotional campaigns are used to announce fresh harvests, festival gift boxes (Diwali, Eid, New Year), and dry fruits reorders.

### 3.1 Creating a Campaign
1. Navigate to the **Campaigns** tab.
2. Click **+ New Campaign**.
3. Fill in the campaign form:
   - **Campaign Name:** Descriptive title (e.g. *"Fresh Harvest 2026 Jumbo Makhana Launch"*).
   - **Category:** Choose from `Dry Fruits & Nuts`, `Kashmiri Products`, `Wedding Hampers`, `Seasonal Promotion`, or `Repeat Purchase`.
   - **Target Segment:** Choose audience (e.g. `Repeat Buyers`, `High-Value (₹5000+)`, `Abandoned Checkouts`, or `All Opted-In Customers`).
   - **Approved Template:** Select an approved Meta template (e.g. `repeat_purchase_v1` or `abandoned_cart_v1`).
4. Click **Preview Audience & Cost 🔍**:
   - The system displays the number of **Eligible Opted-In contacts**.
   - Shows the number of **Suppressed Opted-Out contacts** (automatically excluded).
   - Displays the **Estimated Meta Messaging Cost** (calculated at ~₹0.88 per message in India).
5. Click **Save Campaign**.

### 3.2 Executing a Campaign
1. In the Campaigns table, review the draft campaign.
2. Click **Dispatch Now 🚀**.
3. Confirm the execution prompt.
4. The system executes the broadcast using rate-limited batch throttling to maintain high delivery rates and protect the sender reputation.

---

## 4. COMPLIANCE & CUSTOMER OPT-OUTS

1. **Automated Keyword Suppression:**
   If a customer sends any opt-out keyword (`STOP`, `UNSUBSCRIBE`, `ROKO`, `BAND KARO`, `CANCEL`), the system automatically:
   - Sets their status to `OPTED_OUT`.
   - Sends an instant confirmation: *"You have been unsubscribed from Nuty Tales promotional messages. You will still receive essential order and shipping updates."*
   - Blocks the customer from all future marketing campaigns.
2. **Re-Subscribing Customers:**
   If a customer sends `START` or `SUBSCRIBE`, the system re-enables their promotional opt-in status.
3. **Never Override Opt-Outs:**
   Staff members must never manually send promotional offers to opted-out contacts.

---

## 5. BUSINESS PERFORMANCE & ATTRIBUTION TOWARD ₹10 LAKH TARGET

The Nuty Tales commerce target is **₹10 Lakh monthly sales**. The WhatsApp Commerce OS tracks live attribution directly on the Overview tab:
- **Attributed Revenue (₹):** Live sales resulting from order confirmation links, abandoned cart recovery vouchers (`NUTY10`), and repeat purchase nudges.
- **Lead-to-Order Conversion Rate:** Monitored against e-commerce benchmarks (target: &gt;12%).
- **Average Order Value (AOV):** Calculated from live orders (target: ₹1,800+).
- **Downloadable Reporting:** Click **Export CSV** in the top-right corner to download weekly performance summaries for finance and executive reviews.
