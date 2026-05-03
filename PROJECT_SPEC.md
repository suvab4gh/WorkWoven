## Project Kickoff Guideline: WorkWoven

### 1. Core Concept (Keep us focused)
We are building the MVP of a decentralized labor trust & settlement network for informal workers.  
**One simple demo story:**  
*Worker “Maria” creates a portable identity (ENS subname) with verifiable skills, matches with an employer’s AI agent, completes a task, submits proof, and gets paid automatically — all peer-to-peer, no central platform.*

### 2. Sponsor Integration Map (non‑negotiable)
Every integration must serve the core story; nothing is decorative.

| Sponsor | What we use | Why it matters |
|---------|--------------|----------------|
| **ENS** | Subname (`maria.labor.eth`) + Text records for verifiable credentials & reputation hashes | Worker/employer identity; discoverability; trust without exposing private data |
| **0G** | 0G Storage (KV + Log) for agent memory and proof storage; 0G Compute (qwen3.6-plus sealed inference) for agent reasoning; 0G Chain for escrow contract | Persistent AI agent memory, verifiable inference, on‑chain settlement |
| **Gensyn AXL** | Encrypted P2P communication between worker agent and employer agent (separate nodes) | No central server; agents negotiate, exchange evidence, and coordinate directly |
| **KeeperHub** | MCP server / CLI to execute payout when verifier agent confirms work | Guaranteed execution with retry logic, gas optimisation, audit trail |
| **Uniswap API** | Swap USDC to local stablecoin (cUSD, etc.) inside the payout flow | Worker gets local currency; real on‑chain settlement |

### 3. High‑Level Architecture (the “must‑have” diagram)
We’ll submit this as the architecture diagram. Make sure the repo `README` includes it.

```text
+---------------+       AXL (encrypted)       +-------------------+
|  Worker UI    | <------------------------> |  Employer UI      |
| (ENS login)   |                             | (Job poster)      |
+-------+-------+                             +---------+---------+
        |                                               |
        v                                               v
+-------+-------+       AXL                +-----------+-----------+
| Worker Agent  | <----------------------> | Employer Agent         |
| (Node A)      |                          | (Node B)               |
+---------------+                          +------------------------+
        |                                       |                 |
        | stores proofs                         | escrows funds   |
        v                                       v                 v
+-------+-------+     +--------------+    +-----------+    +-----------+
| 0G Storage    |     | 0G Compute   |    | 0G Chain  |    | KeeperHub |
| - KV (state)  |     | (inference)  |    | Escrow    |    | (payout)  |
| - Log (hist.) |     |              |    +-----------+    +-----------+
+---------------+     +--------------+                         |
                                                               v
                                                       +---------------+
                                                       | Uniswap API   |
                                                       | (optional)    |
                                                       +---------------+
```

**Agent design:**  
- *Matcher Agent* — run on 0G Compute, accesses 0G Storage to match job requirements with worker profiles.  
- *Verifier Agent* — receives multi‑modal evidence (image, text) via AXL, call 0G inference to produce a signed verification result.  
- *Resolver Agent* — in case of dispute, reads the full log history from 0G Storage and suggests fair outcome (pay/refund).  
All three agents coordinate through **shared 0G Storage memory** (KV for live state, Log for immutable history).  

### 4. Technology Stack & Local Setup Requirements

- **Smart contracts & Escrow:** Solidity, deployed on 0G Chain (EVM‑compatible).  
- **Agent runtime:** Node.js or Python (we choose Python for ease of AI libs and AXL CLI bindings).  
- **ENS interaction:** ethers.js (or viem) + ENS SDK.  
- **0G Storage/Compute:** Use 0G’s SDK/CLI; deploy sealed inference container referencing `qwen3.6-plus`.  
- **AXL:** Run AXL binary locally on both worker and employer machines; agents communicate via `localhost` HTTP requests encrypted by AXL.  
- **KeeperHub:** Use the MCP server or CLI; call from verifier agent to trigger payout.  
- **Uniswap API:** REST calls from worker agent after payment received, if swap is needed.  

**Development environment rule:** All team members must run AXL nodes on separate machines (or separate ports with different identities) to satisfy the “cross‑node communication” requirement.

### 5. Development Phases & Milestones (2‑day hackathon timeline)

#### Phase 0 – Project Genesis (first 2 hours)
- [x] Create public GitHub repo with this `PROJECT_SPEC.md`
- [x] Initialize version control (git init, first commit)
- [ ] Allocate team roles: Smart contracts, Agent logic, Frontend, Integration glue
- [ ] Register ENS domain (e.g., `laboragent.eth`) and create subname logic mock

#### Phase 1 – Core Infrastructure (hours 2‑8)
- [ ] Deploy a minimal **Escrow smart contract** on 0G Chain (address to include in submission)
- [ ] Set up 0G Storage bucket; implement KV put/get and Log append for agent memory
- [ ] Boot **two AXL nodes** (worker and employer); send a simple encrypted “ping” between them via HTTP
- [ ] Implement basic ENS resolution: resolve `worker.labor.eth` → address, read a text record (`proofs.0g.hash`)

#### Phase 2 – Agent Brains (hours 8‑16)
- [ ] Matcher Agent: query 0G Storage KV for worker profiles; use hardcoded rule (later swap to 0G Compute inference)
- [ ] Verifier Agent: receive evidence via AXL; call 0G Compute sealed endpoint with the evidence; return “success”/“failure” payload
- [ ] Resolver Agent (simplified): if no dispute, just forward the verifier’s signed result
- [ ] Wire up KeeperHub CLI: Verifier agent calls `keeperhub execute` with contract address and signed proof to release funds

#### Phase 3 – Full Demo Flow (hours 16‑22)
- [ ] Connect frontend (minimal React or Streamlit) for worker (ENS login, accept job, upload proof) and employer (post job, escrow)
- [ ] Record full demo video (under 3 mins): Maria creates identity → job posted → matched → work proof → verifier agent confirms → KeeperHub pays → optional Uniswap swap
- [ ] Capture Uniswap API integration: worker agent swaps 50% of USDC to local stablecoin, showing the API call in the demo

#### Phase 4 – Polish & Submission (hours 22‑24)
- [ ] Write `README.md` with setup instructions, architecture diagram, example agent code, and sponsor usage explanation
- [ ] Fill out `FEEDBACK.md` (mandatory for Uniswap) and KeeperHub feedback document
- [ ] Record clean demo video (2–4 min, 720p+, no AI voiceover, no music with text)
- [ ] Commit all code with meaningful history; tag final commit as `hackathon-submission`
- [ ] Submit via Hacker Dashboard, select **0G Autonomous Agent, ENS, Gensyn AXL, KeeperHub, Uniswap API** (three partner prize slots, picking them as described).

### 6. Repository Structure (exact folders)
```text
/WorkWoven
├── README.md                # Project description, setup, architecture, demo link
├── PROJECT_SPEC.md          # This document
├── FEEDBACK.md              # Uniswap API feedback (required)
├── keeperhub_feedback.md    # KeeperHub feedback bounty
├── contracts/
│   ├── Escrow.sol           # Deployed on 0G Chain
│   └── deploy_script.js
├── agents/
│   ├── worker-agent/        # Python, uses AXL, 0G SDK, KeeperHub CLI
│   ├── employer-agent/      # Python, posts jobs, escrows
│   └── matcher-verifier/    # Inference logic, 0G Compute calls
├── axl-config/              # AXL node configs for worker/employer
├── ui/                      # Minimal frontend
├── demo/                    # Scripts to reproduce the full flow
└── assets/                  # Architecture diagram, screenshots
```

### 7. Key Submission Rules to Never Forget
- **Start from zero** – the first commit must be after hackathon start. No pre‑built code.
- **Transparent AI use** – if you use Cursor/Copilot/ChatGPT, document which files were AI‑aided in a `AI_ATTRIBUTION.md`.
- **Contract address** – Escrow on 0G Chain must be in README.
- **AXL cross‑node proof** – demo must show two separate AXL nodes communicating (screenshot or video segment).
- **ENS real functionality** – no hardcoded values; must resolve on‑chain.
- **Demo video** – ≤3 minutes (recommend 2:45), clearly show the agent swarm collaborating and payment executing.

### 8. “Why This Wins” Talking Points (for judges)
- We built a **real‑world labour trust system**, not another trading bot.
- Every sponsor technology is **structurally necessary** — remove one, the trust/settlement model breaks.
- We demonstrated **multi‑agent coordination over encrypted P2P**, persistent on‑chain memory, and automated settlement.
- We opened a completely new user base for crypto: the 1.7 billion informal workers who need portable reputation and guaranteed payment.
