#!/usr/bin/env python3
"""
Nuty Tales Pre-Launch Intelligence Engine (PLIE)
MiroFish Autonomous Market Simulation Sidecar
=================================================
Runs an isolated HTTP service providing:
1. Persona Generation
2. Market Simulation
3. Price Sensitivity Analysis
4. Product Preference Modeling
5. Purchase Objection Identification
6. Cart Abandonment Simulation
7. Behavioral Friction Analysis

Preserves strict AGPL-3.0 isolation boundary via clean HTTP REST contract.
Notice: Synthetic market opinions are simulated algorithmic models, NOT real customer research.
"""

import sys
import json
import random
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

HOST = "127.0.0.1"
PORT = 8000

NUTY_TALES_CATALOG = [
  {"id": "kashmiri-walnuts-500g", "name": "Kashmiri Snow White Walnut Kernels", "price": 899, "category": "walnuts"},
  {"id": "kashmir-saffron-1g", "name": "Pure Kashmiri Mogra Saffron (Grade A1)", "price": 499, "category": "saffron"},
  {"id": "mamra-badam-500g", "name": "Royal Kashmiri Mamra Almonds", "price": 1499, "category": "almonds"},
  {"id": "kashmiri-morels-guchhi-100g", "name": "Wild Himalayan Guchhi (Morels)", "price": 3200, "category": "mushrooms"},
  {"id": "luxury-wedding-hamper-regal", "name": "Regal Kashmir Bespoke Gifting Trunk", "price": 4500, "category": "hampers"},
]

def generate_synthetic_persona(persona_type="retail_consumer"):
    cities = ["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Srinagar", "Pune", "Kolkata", "Chennai"]
    devices = ["mobile_safari", "mobile_chrome", "desktop_chrome"]
    intents = ["purchase_cod", "purchase_razorpay", "bulk_rfq", "browse"]
    
    city = random.choice(cities)
    device = random.choice(devices)
    intent = random.choice(intents)
    budget = random.randint(1000, 10000)
    
    return {
        "id": f"MIRO-PER-{random.randint(1000, 9999)}",
        "type": persona_type,
        "city": city,
        "device": device,
        "primary_intent": intent,
        "budget_inr": budget,
        "price_sensitivity": "HIGH" if budget < 2000 else ("MEDIUM" if budget < 5000 else "LOW"),
        "luxury_affinity": budget > 4000,
        "source": "mirofish_synthetic_simulation"
    }

def evaluate_simulation(data):
    persona = data.get("persona", generate_synthetic_persona())
    product_id = data.get("productId", "kashmiri-walnuts-500g")
    offered_price = data.get("offeredPrice", 899)
    shipping_fee = data.get("shippingFee", 0)
    
    # 1. Price Sensitivity Evaluation
    budget = persona.get("budget_inr", 2500)
    price_ratio = (offered_price + shipping_fee) / max(budget, 1)
    
    if price_ratio > 1.0:
        price_verdict = "REJECTED_EXCEEDS_BUDGET"
        friction_score = 90
    elif price_ratio > 0.6:
        price_verdict = "HESITANT_PRICE_OBJECTION"
        friction_score = 65
    else:
        price_verdict = "ACCEPTABLE_VALUE"
        friction_score = 15
        
    # 2. Product Preference
    preference_score = 85 if "walnut" in product_id or "saffron" in product_id else 70
    
    # 3. Purchase Objections
    objections = []
    if shipping_fee > 0 and offered_price < 1500:
        objections.append({"type": "SHIPPING_FEE_SURPRISE", "severity": "MEDIUM", "note": f"Added shipping fee ₹{shipping_fee} caused checkout hesitation."})
    if offered_price > 3000 and persona.get("device") != "desktop_chrome":
        objections.append({"type": "HIGH_TICKET_MOBILE_FRICTION", "severity": "LOW", "note": "High value cart on mobile device creates trust verification delay."})
        
    # 4. Cart Abandonment Probability
    abandonment_prob = 0.15
    if price_verdict == "REJECTED_EXCEEDS_BUDGET":
        abandonment_prob = 0.95
    elif price_verdict == "HESITANT_PRICE_OBJECTION":
        abandonment_prob = 0.45
    if shipping_fee > 150:
        abandonment_prob += 0.25
        
    abandonment_risk = min(0.99, abandonment_prob)
    
    # 5. Behavioral Friction Analysis
    friction_factors = [
        {"factor": "Checkout steps count", "rating": "GOOD (2 steps)", "penalty": 0},
        {"factor": "Payment options variety", "rating": "GOOD (Razorpay + COD)", "penalty": 0},
    ]
    if persona.get("device") == "mobile_safari":
        friction_factors.append({"factor": "Mobile viewport touch targets", "rating": "ACCEPTABLE", "penalty": 5})
        
    return {
        "simulationId": f"MIRO-SIM-{random.randint(10000, 99999)}",
        "personaId": persona.get("id"),
        "productId": product_id,
        "priceSensitivity": {
            "verdict": price_verdict,
            "budget": budget,
            "totalCost": offered_price + shipping_fee,
            "frictionScore": friction_score
        },
        "productPreference": {
            "score": preference_score,
            "categoryFit": "STRONG"
        },
        "purchaseObjections": objections,
        "cartAbandonment": {
            "riskProbability": round(abandonment_risk, 2),
            "predictedOutcome": "ABANDON" if abandonment_risk > 0.70 else "CONVERT"
        },
        "behavioralFriction": {
            "overallScore": friction_score,
            "factors": friction_factors
        },
        "legalNotice": "Synthetic agent simulation output. Not actual customer behavioral research."
    }

class MiroFishHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/health":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "ok",
                "service": "MiroFish Autonomous Market Simulation Sidecar",
                "version": "1.0.0",
                "targetPlatform": "Nuty Tales",
                "mode": "ISOLATED_SIDECAR"
            }).encode("utf-8"))
            return
            
        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        content_len = int(self.headers.get("Content-Length", 0))
        post_body = self.rfile.read(content_len).decode("utf-8") if content_len > 0 else "{}"
        
        try:
            payload = json.loads(post_body) if post_body else {}
        except Exception:
            payload = {}

        if parsed.path == "/personas/generate":
            persona = generate_synthetic_persona(payload.get("type", "retail_consumer"))
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "persona": persona}).encode("utf-8"))
            return

        if parsed.path == "/simulation/evaluate":
            sim_result = evaluate_simulation(payload)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "result": sim_result}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

def run():
    server = HTTPServer((HOST, PORT), MiroFishHandler)
    print(f"[MiroFish Sidecar] Running isolated simulation server on http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

if __name__ == "__main__":
    run()
