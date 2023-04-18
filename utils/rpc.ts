import { quais } from "quais";


// Custom error class for retry limit exceeded
export class RetryLimitExceededError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RetryLimitExceededError";
    }
  }
  
export async function CheckBalance (provider: quais.JsonRpcProvider, walletWithProvider: any, value) {
    const balanace = await provider.getBalance(walletWithProvider.address);
    if(Number(balanace) < value) {
        console.log("Insufficient balance", "Balance", Number(balanace), "Sending", value);
        throw Error("Insufficient balance");
    }
}

export async function CheckBalanceBackoff (provider: quais.JsonRpcProvider, walletWithProvider: any, value,     maxRetries = 5,
    initialDelay = 500,
    maxDelay = 16000): Promise<any> {
        let currentRetry = 0;
        let delay = initialDelay;
          
        while (currentRetry <= maxRetries) {
          try {
            CheckBalance(provider, walletWithProvider, value);
            return;      
          } catch (err) {
            console.log("err: ", err, currentRetry, maxRetries)
            if (currentRetry === maxRetries) {
              throw new RetryLimitExceededError("Retry limit exceeded.");
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
            currentRetry++;
            delay = Math.min(delay * 2, maxDelay);
          }
        }
}