# NUTY TALES — MIROFISH COMPATIBILITY ASSESSMENT
**Date:** 2026-10-30  
**Subject:** https://github.com/666ghj/MiroFish  
**Purpose:** Assess fit for autonomous synthetic customer and pre-launch testing

> **IMPORTANT:** MiroFish upstream code was not cloned or executed. This assessment is based on public documentation, web research, and GitHub README analysis only. No MiroFish code has been introduced to the Nuty Tales repository.

---

## 1. WHAT IS MIROFISH?

MiroFish (GitHub: `666ghj/MiroFish`) is a swarm intelligence and prediction engine designed for synthetic market simulation. It builds a knowledge graph (via GraphRAG) from seed documents and uses the OASIS multi-agent framework (from CAMEL-AI) to spin up hundreds or thousands of autonomous virtual agents that interact, debate, and simulate realistic market behavior.

**Key capabilities:**
- Generates synthetic customer personas from product briefs
- Simulates market sentiment, adoption curves, and pricing resistance
- Runs multi-round simulations with persistent memory (via Zep or local graph)
- Produces a `ReportAgent` analysis with interactive interrogation
- Exposes API endpoints that can be called programmatically

**License:** AGPL-3.0

---

## 2. DEPLOYMENT REQUIREMENTS

### Minimum Infrastructure (Based on Research)
| Component | Requirement | Notes |
|---|---|---|
| Python runtime | 3.10+ | MiroFish is Python-based |
| LLM access | OpenAI GPT-4o or equivalent | Required for agent reasoning |
| Zep Memory | Zep Cloud or self-hosted | Persistent agent memory |
| GraphRAG | Microsoft GraphRAG or LlamaIndex | Knowledge graph construction |
| OASIS framework | CAMEL-AI OASIS | Multi-agent simulation engine |
| Redis (optional) | For high-concurrency agent state | May be needed for large swarms |
| Vector store | Chroma, Pinecone, or Weaviate | For semantic similarity |

### Hosting Options
| Option | Complexity | Cost Estimate |
|---|---|---|
| **Docker on any VPS** | Medium | \$20–100/month + LLM API costs |
| **Separate Vercel Serverless** | Not viable | Python not supported on Vercel |
| **AWS EC2 / GCP Compute** | Medium | \$50–200/month |
| **Railway / Render** | Low | \$25–75/month |
| **Local development machine** | Lowest | LLM API costs only |

**Vercel (where Nuty Tales runs) CANNOT host MiroFish** — Vercel only supports Node.js/Edge functions; MiroFish requires a persistent Python process.

---

## 3. API INTEGRATION POSSIBILITIES WITH NUTY TALES

### Viable Integration Points (WITHOUT embedding AGPL code)
MiroFish can be run as a **standalone sidecar service** that communicates with Nuty Tales via HTTP API calls. This pattern keeps the AGPL code completely isolated.

```
MiroFish Sidecar Service (Python, separate host)
        ↑↓ HTTP REST
Nuty Tales Next.js Application (Vercel)
        ↑↓
Supabase Database
```

### What MiroFish Can Test Against Nuty Tales
1. **Product-market fit simulation** — Feed MiroFish the product catalogue and pricing; it simulates buyer personas debating value-for-money
2. **Price sensitivity analysis** — Simulate Indian B2C and B2B buyer responses to ₹899/kg makhana, Kashmiri saffron pricing
3. **Funnel simulation** — Agents simulate browsing `/shop`, attempting checkout, encountering payment-not-wired, abandoning
4. **Content testing** — Feed MiroFish the homepage copy and marketing messaging; agents argue authenticity and trust signals
5. **Objection identification** — Agents surface concerns (FSSAI certification trust, origin verification, delivery time anxiety)

### Programmatic Integration Steps (Post-Legal Review)
1. Deploy MiroFish on a separate server (Railway, GCP, or local)
2. Create a Nuty Tales seed packet: product catalogue JSON, pricing tiers, brand story from `llms.txt`
3. Configure OASIS with 100–500 synthetic Indian buyer personas (demographics: Delhi NCR, Mumbai, Bengaluru; purchase intent: health-conscious, gifting, wholesale)
4. Call MiroFish API with seed; receive simulation results
5. Pipe `ReportAgent` output into a pre-launch readiness dashboard

---

## 4. OASIS COMPATIBILITY ASSESSMENT

| Aspect | Assessment |
|---|---|
| **Nuty Tales data format** | Nuty Tales has `llms.txt` and `llms-full.txt` routes — ideal OASIS seed format |
| **Product data** | Static `products-data.ts` can be serialized to JSON for OASIS context injection |
| **Persona targets** | Indian B2C consumers, B2B buyers (hotels, bakeries, sweet shops), NRI diaspora, wedding planners — all well-defined in Nuty Tales copy |
| **Simulation scenarios** | Price negotiation (B2B tiers), gifting occasion selection, trust/quality skepticism, delivery logistics anxiety |
| **API surface** | MiroFish's simulation API can be called from a pre-launch test orchestrator without code embedding |

**OASIS is well-suited** for testing Nuty Tales' value proposition before live customer exposure.

---

## 5. LLM REQUIREMENTS

MiroFish / OASIS agents require LLM access for:
- Persona reasoning and response generation
- GraphRAG knowledge extraction
- ReportAgent synthesis

### Recommended LLMs for Nuty Tales Simulation
| LLM | Rationale |
|---|---|
| OpenAI GPT-4o | Best reasoning; MiroFish default |
| Google Gemini 1.5 Pro | Native multilingual (Hindi/English code-switching relevant for Indian market) |
| Anthropic Claude 3.5 Sonnet | Strong instruction following for controlled simulations |

### Estimated LLM Costs (Pre-Launch Testing)
- 100-agent simulation, 10 rounds: ~\$5–20 per run (GPT-4o pricing)
- Full pre-launch battery (5 scenarios × 500 agents): ~\$100–300 total
- **Acceptable for pre-launch budget**

---

## 6. ZEP MEMORY DEPENDENCIES

MiroFish uses Zep for persistent agent memory (agents remember past "conversations" and evolve opinions across rounds).

### Zep Options
| Option | Notes |
|---|---|
| **Zep Cloud** | Managed service; easiest; ~\$49–200/month depending on agents |
| **Zep self-hosted** | Docker deployment; free; requires dedicated server |
| **Memory-free mode** | Some OASIS configurations run without Zep; agents lose memory between rounds |

**Recommendation:** Start with Zep Cloud for the pre-launch testing sprint; migrate to self-hosted if simulation becomes ongoing.

---

## 7. AGPL-3.0 LICENSE IMPLICATIONS

This is the **most critical constraint** for Nuty Tales.

### AGPL-3.0 Requires
- If MiroFish code is **embedded** into Nuty Tales application and the application is served over a network, the **entire Nuty Tales application source must be made publicly available** under AGPL-3.0.
- This would expose proprietary business logic, database schemas, pricing algorithms, seller integrations, and customer data structures.

### Safe Usage Patterns (AGPL-compliant without disclosure)
| Pattern | Safe? |
|---|---|
| MiroFish runs as a standalone separate service; Nuty Tales calls it via HTTP API | ✅ **SAFE** — No AGPL code in Nuty Tales |
| MiroFish Python scripts run locally by developers (not served to users) | ✅ **SAFE** — Private use exemption |
| MiroFish code copied into `src/` of Nuty Tales | ❌ **UNSAFE** — Triggers AGPL network use clause |
| MiroFish bundled as Next.js API route | ❌ **UNSAFE** |
| Forking MiroFish for internal use only (no network service) | ⚠️ **GREY AREA** — Seek legal advice |

### **MANDATORY LEGAL REVIEW REQUIRED** before any MiroFish integration with the production Nuty Tales codebase.

---

## 8. RESOURCE AND OPERATING COSTS SUMMARY

| Item | Setup Cost | Monthly Run Cost |
|---|---|---|
| MiroFish server (Railway or GCP) | \$0 setup | \$25–50/month |
| Zep Cloud (100 agents) | \$0 setup | \$49–99/month |
| LLM API (GPT-4o) | \$0 setup | \$50–200/month (usage-based) |
| **Pre-launch battery (one-time)** | — | **~\$200–500 total** |
| **Ongoing monthly (if retained)** | — | **~\$125–350/month** |

---

## 9. RECOMMENDATION

### For Pre-Launch Testing
MiroFish is **appropriate and valuable** for Nuty Tales pre-launch purposes, with the following conditions:

**APPROVED approach:**
1. ✅ Deploy MiroFish as a standalone sidecar on Railway or GCP Compute
2. ✅ Feed Nuty Tales `llms.txt` content + product catalogue JSON as seed
3. ✅ Run 3 simulation scenarios: (a) B2C checkout journey, (b) B2B wholesale negotiation, (c) Wedding gifting discovery
4. ✅ Use ReportAgent output to identify messaging gaps, pricing friction, and trust gaps before launch
5. ✅ No MiroFish code embedded in Nuty Tales

**NOT APPROVED without legal review:**
- ❌ Embedding MiroFish code in Nuty Tales source
- ❌ Modifying upstream MiroFish
- ❌ Using AGPL code in any route served to end users

### Alternative: Custom Playwright-based Synthetic Customer
A lighter alternative to full MiroFish is a purpose-built **Playwright synthetic customer runner** with GPT-4o prompt-driven decision logic. This avoids AGPL entirely and integrates directly with Nuty Tales staging. See `NUTY_TALES_QA_ARCHITECTURE.md`.

---

## 10. DO NOT DO LIST

- ❌ Do not clone MiroFish into the `src/` directory
- ❌ Do not `npm install` or `pip install` MiroFish as a package in the Next.js project
- ❌ Do not create API routes that run MiroFish Python scripts from Node.js
- ❌ Do not use MiroFish output as authoritative "test results" — it is exploratory only
- ❌ Do not run simulations against the production database
