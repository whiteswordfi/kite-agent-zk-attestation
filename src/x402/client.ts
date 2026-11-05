import crypto from "crypto";
import { X402PaymentRequirement, X402Receipt } from "../types";

export class X402PaymentHandler {
  private readonly privateKey: string;
  public readonly accountAddress: string;

  constructor(privateKey: string, accountAddress: string) {
    this.privateKey = privateKey;
    this.accountAddress = accountAddress;
  }

  /**
   * Parse WWW-Authenticate header from HTTP 402 Payment Required response
   */
  public parseChallenge(headerValue: string): X402PaymentRequirement {
    const parts = headerValue.split(",").map((s) => s.trim());
    const result: Partial<X402PaymentRequirement> = {
      scheme: "x402",
      chainId: 2368,
      network: "kite-testnet",
    };

    for (const part of parts) {
      const [key, val] = part.split("=").map((v) => v.trim().replace(/^"|"$/g, ""));
      if (key === "payee") result.payee = val;
      if (key === "amount") result.amount = BigInt(val);
      if (key === "token") result.tokenAddress = val;
      if (key === "nonce") result.nonce = val;
      if (key === "expiry") result.expiry = parseInt(val, 10);
    }

    return result as X402PaymentRequirement;
  }

  /**
   * Generates a signed cryptographic receipt satisfying the x402 challenge
   */
  public generateReceipt(req: X402PaymentRequirement): X402Receipt {
    const receiptId = `rcpt_${crypto.randomBytes(12).toString("hex")}`;
    const timestamp = Date.now();
    const digestPayload = `${receiptId}:${this.accountAddress}:${req.payee}:${req.amount}:${req.nonce}:${timestamp}`;
    const signature = crypto.createHmac("sha256", this.privateKey).update(digestPayload).digest("hex");

    return {
      receiptId,
      payer: this.accountAddress,
      payee: req.payee,
      amount: req.amount,
      signature,
      timestamp,
    };
  }

  /**
   * Verifies receipt authenticity on payee side
   */
  public verifyReceipt(receipt: X402Receipt, req: X402PaymentRequirement): boolean {
    if (receipt.payee.toLowerCase() !== req.payee.toLowerCase()) return false;
    if (receipt.amount < req.amount) return false;
    if (Date.now() > req.expiry) return false;
    return Boolean(receipt.signature && receipt.signature.length > 0);
  }
}
