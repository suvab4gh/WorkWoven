import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // --- API Routes (Mocks for the hackathon MVP) ---

  // Mock: Matcher Agent
  app.get("/api/agents/matcher", (req, res) => {
    // In a real app this would query 0G Storage/Compute
    res.json({
      status: "success",
      matched_worker: {
        id: "maria.labor.eth",
        skills: ["Python", "Data Dashboard", "React"],
        reputation: 4.8,
        proof_hash: "0xabc123..."
      }
    });
  });

  // Mock: Verifier Agent
  app.post("/api/agents/verifier", (req, res) => {
    // Escrow payout and validation simulator
    const { action, evidence, jobId } = req.body;
    
    // Simulate 0G Compute inference delay
    setTimeout(() => {
      res.json({
        status: "success",
        action: "verified",
        details: "Evidence matches job requirements. Multi-modal inference complete.",
        signature: "0xsig_999888...",
      });
    }, 1500);
  });

  // Mock: KeeperHub payout trigger
  app.post("/api/keeperhub/execute", (req, res) => {
    setTimeout(() => {
      res.json({
        status: "success",
        transactionHash: "0x789tx...",
        message: "Payment released from escrow smart contract to maria.labor.eth"
      });
    }, 1000);
  });
  
  // Mock: Uniswap API (Swap to cUSD)
  app.post("/api/uniswap/swap", (req, res) => {
    setTimeout(() => {
      res.json({
        status: "success",
        swappedAmount: "150 cUSD",
        fee: "0.01 USDC",
        hash: "0xswap_456..."
      });
    }, 800);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
