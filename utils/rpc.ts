import { quais } from "quais";
import axios from "axios";
// Custom error class for retry limit exceeded
export class RetryLimitExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RetryLimitExceededError";
  }
}

export async function CheckBalance(
  provider: quais.JsonRpcProvider,
  walletWithProvider: any,
  value
) {
  const balanace = await provider.getBalance(walletWithProvider.address);
  if (Number(balanace) < value) {
    console.log(
      "Insufficient balance",
      "Balance",
      Number(balanace),
      "Sending",
      value
    );
    throw Error("Insufficient balance");
  }
}

export async function CheckBalanceBackoff(
  provider: quais.JsonRpcProvider,
  walletWithProvider: any,
  value,
  maxRetries = 5,
  initialDelay = 500,
  maxDelay = 16000
): Promise<any> {
  let currentRetry = 0;
  let delay = initialDelay;

  while (currentRetry <= maxRetries) {
    try {
      await CheckBalance(provider, walletWithProvider, value);
      return;
    } catch (err) {
      console.log("err: ", err, currentRetry, maxRetries);
      if (currentRetry === maxRetries) {
        throw new RetryLimitExceededError("Retry limit exceeded.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      currentRetry++;
      delay = Math.min(delay * 2, maxDelay);
    }
  }
}

class MempoolStatus {
  pending: number;
  queued: number;
}

export async function CheckMempoolBackoff(
  url,
  memPoolSize,
  maxRetries = 5,
  initialDelay = 500,
  maxDelay = 16000
) {
  let currentRetry = 0;
  let delay = initialDelay;

  while (currentRetry <= maxRetries) {
    try {
      const txStatus = await lookupTxPending(url) as MempoolStatus;
      console.log(
        "Checking mempool size",
        "pending:",
        txStatus.pending,
        "mempoolSize:",
        "queued:",
        txStatus.queued,
        memPoolSize
      );
      if (txStatus.pending > memPoolSize || txStatus.queued) {
        throw Error("Mempool size exceeded");
      }
      console.log("Mempool size acceptable, continue sending");
      return;
    } catch (err) {
      if (currentRetry === maxRetries) {
        throw new RetryLimitExceededError("Retry limit exceeded.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      currentRetry++;
      delay = Math.min(delay * 2, maxDelay);
    }
  }
}

async function lookupTxPending(url) {
  try {
    const result = await axios.post(url, {
      jsonrpc: "2.0",
      method: "txpool_status",
      id: 1,
    });
    if (result.data.error) {
      console.log("Error: ", result.data.error.message);
      return 0;
    }
    const resPend = result.data.result.pending;
    const resQueued = result.data.result.queued;
    return { pending: Number(resPend), queued: Number(resQueued) };
  } catch (error) {
    console.log("Error: ", error);
    return 0;
  }
}
