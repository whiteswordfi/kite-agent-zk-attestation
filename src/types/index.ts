/**
 * Core Type Definitions for kite-agent-zk-attestation
 * Compatible with KiteAI x402 Protocol Specifications (eip155:2368)
 */

export interface X402PaymentRequirement {
  scheme: "x402";
  network: "kite-testnet" | "kite-mainnet";
  chainId: number; // 2368 for Kite Testnet
  payee: string;
  amount: bigint;
  tokenAddress: string;
  nonce: string;
  expiry: number;
}

export interface X402Receipt {
  receiptId: string;
  payer: string;
  payee: string;
  amount: bigint;
  signature: string;
  timestamp: number;
  blockNumber?: number;
}

export interface AgentConfig {
  agentId: string;
  accountAddress: string;
  rpcEndpoint: string;
  settlementThreshold: bigint;
  timeoutMs: number;
}

export interface ExecutionRecord {
  id: string;
  status: "PENDING" | "VERIFIED" | "FAILED";
  timestamp: number;
  payloadDigest: string;
  receipt?: X402Receipt;
}
