# kite-agent-zk-attestation

[![KiteAI Ecosystem](https://img.shields.io/badge/Ecosystem-KiteAI-blue.svg)](https://gokite.ai)
[![Protocol](https://img.shields.io/badge/Protocol-x402-purple.svg)](https://x402.org)
[![Network](https://img.shields.io/badge/Network-Kite_Testnet_(2368)-green.svg)](https://rpc-testnet.gokite.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Succinct ZK State Transition Attestation & Agent Authenticity Verifier

---

## 🌟 Overview

**`kite-agent-zk-attestation`** is an open-source, production-grade protocol component designed for the **KiteAI** autonomous agent economy. Built directly on top of the **HTTP 402 (x402)** micro-settlement standard and Kite Chain (`eip155:2368`), this module provides seamless, cryptographic payment verification, state synchronization, and verifiable computation for decentralized AI agents.

### 🎯 Key Highlights
* **Native x402 Integration**: Out-of-the-box support for RFC-compliant HTTP 402 payment challenges and instantaneous signed receipt generation.
* **Autonomous Agent Readiness**: Designed for unattended AI worker swarms, orchestrators, and automated DeFi / DePIN pipelines.
* **Tamper-Resistant Verification**: Cryptographically anchored digests ensuring data integrity across high-concurrency RPC invocations.
* **Zero External Bloat**: Clean TypeScript architecture with minimal dependencies, optimized for edge nodes and serverless runtimes.

---

## 🏗️ Architecture

```
[ AI Agent Client / Consumer ]
            |
            | 1. HTTP Request (No Payment)
            v
[ AgentZkAttestation Gateway ]
            |
            | 2. HTTP 402 Payment Required (WWW-Authenticate: x402 ...)
            v
[ Client signs x402 Receipt (Kite Chain) ]
            |
            | 3. Retry with X-Payment-Receipt: <signature>
            v
[ AgentZkAttestation Verified Execution & State Anchor ]
```

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/whiteswordfi/kite-agent-zk-attestation.git
cd kite-agent-zk-attestation

# Install dependencies
npm install
```

---

## 🚀 Quick Start

```typescript
import { AgentZkAttestation, X402PaymentHandler } from "@whiteswordfi/kite-agent-zk-attestation";

// 1. Configure the Agent
const config = {
  agentId: "agent-alpha-01",
  accountAddress: "0xYourKiteAddress...",
  rpcEndpoint: "https://rpc-testnet.gokite.ai",
  settlementThreshold: 1000000n,
  timeoutMs: 5000,
};

// 2. Initialize the Engine
const engine = new AgentZkAttestation(config, process.env.AGENT_PRIVATE_KEY!);
engine.initialize();

// 3. Process an autonomous task
const result = engine.processOperation({
  action: "agent_inference",
  parameters: { model: "deepseek-r1", context_window: 8192 }
});

console.log("Execution Digest:", result.payloadDigest);
```

---

## 🧪 Testing

Run the included unit test suite:

```bash
npx ts-node test/engine.test.ts
```

All core state transitions and x402 payment handshakes are fully covered with deterministic assertions.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details. Built with ❤️ for the KiteAI Autonomous Economy.
