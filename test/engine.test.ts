import assert from "assert";
import { AgentZkAttestation } from "../src/core/engine";
import { X402PaymentHandler } from "../src/x402/client";
import { X402PaymentRequirement } from "../src/types";

function runTests() {
  console.log("Running test suite for kite-agent-zk-attestation...");

  const config = {
    agentId: "test-agent-001",
    accountAddress: "0x1111111111111111111111111111111111111111",
    rpcEndpoint: "https://rpc-testnet.gokite.ai",
    settlementThreshold: 1000000n,
    timeoutMs: 5000,
  };

  const engine = new AgentZkAttestation(config, "mock-private-key-12345");
  engine.initialize();

  // Test 1: Operation processing
  const op = engine.processOperation({ action: "test_inference", query: "kite-protocol" });
  assert.strictEqual(op.status, "PENDING");
  assert.ok(op.id.startsWith("op_"));

  // Test 2: x402 receipt generation & verification
  const handler = new X402PaymentHandler("test-key", config.accountAddress);
  const requirement: X402PaymentRequirement = {
    scheme: "x402",
    network: "kite-testnet",
    chainId: 2368,
    payee: "0x2222222222222222222222222222222222222222",
    amount: 500000n,
    tokenAddress: "0x0000000000000000000000000000000000000000",
    nonce: "nonce-9988",
    expiry: Date.now() + 60000,
  };

  const receipt = handler.generateReceipt(requirement);
  assert.strictEqual(receipt.payer, config.accountAddress);
  assert.ok(handler.verifyReceipt(receipt, requirement));

  // Test 3: Verified operation processing
  const verifiedOp = engine.processOperation({ action: "paid_execution" }, receipt);
  assert.strictEqual(verifiedOp.status, "VERIFIED");

  const stats = engine.getStats();
  assert.strictEqual(stats.totalRecords, 2);
  assert.strictEqual(stats.verifiedCount, 1);

  console.log("✅ All kite-agent-zk-attestation test assertions passed successfully!");
}

runTests();
