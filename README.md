# WorkWoven

> *On‑chain identity, trust, and autonomous settlements for the world’s 1.7 billion informal workers.*

WorkWoven is the MVP of a decentralized labor trust & settlement network for informal workers built for the Hackathon.

**Team Members:**
- Maria (Smart Contracts & AXL Integration)
- John (Agent Logic & 0G Compute)
- Alex (Frontend UI & ENS Integrations)

## Architecture

![Architecture](https://via.placeholder.com/800x400.png?text=WorkWoven+Architecture)

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

## Demo Flow

*   **Worker Portal**: Worker anchors identity with ENS (e.g., `maria.labor.eth`), accesses jobs parsed and verified from 0G Storage.
*   **Employer Portal**: Employer posts a job to the board which locks the specified funds in a 0G Chain Escrow Smart Contract.
*   **Verification**: The Worker submits evidence using the agent communicating via Gensyn AXL. A backend Matcher/Verifier Agent processes AI logic using 0G Compute to evaluate the work.
*   **Settlement**: Upon verifying validity, a KeeperHub node finalizes the payout to the worker seamlessly, resolving any conversion logic required via Uniswap API.

## Code Pointers (Example Agents)

Check out our reference Agent implementations built with the `@axlsdk/axl` framework:
- [Worker Agent Implementation](./agents/worker-agent/main.py)
- [Inference & Verification Agent](./agents/matcher-verifier/inference.py)

## Repository Setup

To run locally:

```bash
# 1. Install dependencies
npm install

# 2. To run the web app and mock API backend
npm run dev
```

This starts the main UI on `http://localhost:3000`.

**Note on AXL Nodes:** In a production setup, AXL nodes run as separate processes and `localhost` API calls are routed via Gensyn AXL.

## Smart Contract

The core escrow smart contract is deployed on **0G Chain** at:
`0x000000000000000000000000000fake0000000` (Mock Address)

## Mandated APIs & Tech Stack Used

1. **0G Kit SDK (`0g-kit`)**: Integrated for fast and easy interaction with 0G decentralized storage for managing worker file uploads (proofs) and Key-Value (KV) operations for tracking agent states.
2. **0G Compute CLI**: Utilized to list models and verify active endpoints to assure we bind to a live inference provider (`qwen3.6-plus`).
3. **ENS Text Records (`useEnsText`)**: Implemented via `@apollo/client` or `wagmi` to read on-chain key-value data directly from worker subnames (`labor.eth`), acting as verifiable references to the 0G KV entries containing reputation.
4. **AXL Node & SDK (`@axlsdk/axl`)**: Powers the P2P swarm. Agents run dedicated workflows and coordinate securely communicating to the AXL process via Localhost HTTP endpoints. Encryption, routing, and peer discovery are handled cleanly by AXL.
5. **KeeperHub MCP Server**: Leverages MCP to expose smart contract workflows to AI agents. The Verifier agent triggers the execution layer (`escrow.release()`) via KeeperHub natively.
6. **Uniswap Trading API**: Final settlement leverages the `/quote` endpoint with smart order routing to discover the cheapest paths to convert USDC into local currency equivalents (like `cUSD`).
