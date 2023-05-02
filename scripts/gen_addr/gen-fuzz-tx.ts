import { quais } from "quais";
import { allNodeData } from "../node-data";
import { addressList2, shardList } from "../address-list";
import { typeFlag } from "type-flag";
import { getShardFromAddress, getRandomAddressInShard } from "../shard-data";
import * as fs from "fs";
import {
  CheckBalanceBackoff,
  CheckMempoolBackoff,
  RetryLimitExceededError,
} from "../../utils/rpc";
import axios from "axios";

const parsed = typeFlag({
  from: {
    type: String,
    default: "zone-0-0",
    alias: "f",
  },
  interval: {
    type: Number,
    default: 1000,
    alias: "i",
  },
  total: {
    type: Number,
    default: 10,
    alias: "t",
  },
  loValue: {
    type: Number,
    default: 1,
    alias: "l",
  },
  hiValue: {
    type: Number,
    default: 100,
    alias: "h",
  },
  addrList: {
    type: Boolean,
    default: false,
    alias: "a",
  },
  etxRatio: {
    type: Number,
    default: 0.5,
    alias: "e",
  },
  chainID: {
    type: Number,
    default: 15000,
    alias: "c",
  },
  destination: {
    type: String,
    default: null,
    alias: "d",
  },
  random: {
    type: Boolean,
    default: false,
    alias: "r",
  },
  increaseIntervalDelay: {
    type: Number,
    default: 0,
    alias: "I",
  },
  intervalArray: {
    type: [Number],
    default: [0],
    alias: "A",
  },
  memPoolSize: {
    type: Number,
    default: 15000,
    alias: "m",
  },
});

const inputFilePath = "genWallet.json";

const aggBalances: { [key: string]: number } = {};
let errors = 0;

async function main() {
  const from = parsed.flags.from;
  let interval = parsed.flags.interval;
  const total = parsed.flags.total;
  const loValue = parsed.flags.loValue;
  const hiValue = parsed.flags.hiValue;
  const addrList = parsed.flags.addrList;
  const etxRatio = parsed.flags.etxRatio;
  const chainID = parsed.flags.chainID;
  const destination = parsed.flags.destination;
  const random = parsed.flags.random;
  const increaseIntervalDelay = parsed.flags.increaseIntervalDelay;
  const intervalArray = parsed.flags.intervalArray;
  const mempoolSize = parsed.flags.memPoolSize;

  logArgs(from, interval, total, loValue, hiValue, addrList);

  const sendAddrData = allNodeData[from];
  if (sendAddrData == undefined) {
    console.log("Sending address not provided");
    return;
  }

  const sendNodeData = allNodeData[from];

  const provider = new quais.JsonRpcProvider(sendNodeData.provider);

  const genWallet = await fs.promises.readFile(inputFilePath, "utf8");

  const wallet = JSON.parse(genWallet);
  const shardKey = wallet[from as any];
  // const privKey = quais.getBytes(shardKey.privateKey);
  const walletWithProvider = new quais.Wallet(shardKey.privateKey, provider);

  // await provider.ready;

  console.log("Sending Address: ", walletWithProvider.address);

  let nonce = await provider.getTransactionCount(
    walletWithProvider.address,
    "pending"
  );
  let feeData = await provider.getFeeData();

  const shardFrom = getShardFromAddress(walletWithProvider.address)[0];
  const indexOfShard = shardList.indexOf(shardFrom.shard);
  // Remove indexOfShard from the list
  const slicedShardList = shardList
    .slice(0, indexOfShard)
    .concat(shardList.slice(indexOfShard + 1, shardList.length));

  // start time
  const startTime = Date.now();
  console.log("Starting nonce", nonce, "at", startTime);

  let intervalIndex = 0;
  interval = intervalArray[intervalIndex];
  intervalIndex++;
  // for (let i = 0; i < total; i++) {

  while (true) {
    if (increaseIntervalDelay > 0) {
      if (intervalArray.length != intervalIndex) {
        if (Date.now() - startTime > increaseIntervalDelay) {
          console.log(
            "Changing interval delay to",
            intervalArray[intervalIndex],
            "ms"
          );
          interval = intervalArray[intervalIndex];
          intervalIndex++;
        }
      }
    }

    const value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

    if (nonce % 2000 == 0) {
      console.log(
        "Nonce",
        nonce,
        "elapsed",
        Date.now() - startTime,
        "total errors",
        errors
      );
      try {
        await CheckBalanceBackoff(
          provider,
          walletWithProvider,
          value,
          100,
          1000,
          10000
        );
        feeData = await provider.getFeeData();
        nonce = await provider.getTransactionCount(
          walletWithProvider.address,
          "pending"
        );
      } catch (err) {
        if (err instanceof RetryLimitExceededError) {
          console.error("Failed after maximum retries:", err.message);
        } else {
          console.error("Unexpected error:", err);
        }
      }
    }

    if (nonce % mempoolSize == 0) {
      await CheckMempoolBackoff(
        sendNodeData.provider,
        mempoolSize,
        100,
        5000,
        10000
      );
    }

    let receiveAddr;
    let sendExternal = false;

    // If we have a destination, send to an address in that destination
    if (destination) {
      const shardAddr = addressList2[destination];
      receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
      if (shardFrom.shard != destination) {
        sendExternal = true;
      }
    } else if (random) {
      // If we don't have a destination and are sending to a random address,
      // calculate the from ratio and send to an address in a random shard depending on the etxRatio.
      sendExternal = Math.random() < etxRatio;
      if (sendExternal) {
        // Get random shard from the list of shards
        const randomShard =
          slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
        receiveAddr = getRandomAddressInShard(randomShard);
      } else {
        receiveAddr = getRandomAddressInShard(shardFrom.shard);
      }
    } else {
      // If we don't have a destination and we aren't sending to a random address,
      // send to an address in a random shard depending on the etxRatio
      sendExternal = Math.random() < etxRatio;
      if (sendExternal) {
        // Get random shard from the list of shards
        const randomShard =
          slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
        const shardAddr = addressList2[randomShard];

        receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
      } else {
        const shardAddr = addressList2[shardFrom.shard];
        receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
      }
    }

    const rawTransaction = {
      to: receiveAddr,
      value: BigInt(value),
      nonce: nonce,
      gasLimit: BigInt(42000),
      maxFeePerGas: BigInt(Number(feeData.maxFeePerGas) * 2),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      type: 0,
      chainId: BigInt(chainID),
    } as quais.Transaction;

    if (sendExternal) {
      rawTransaction.externalGasLimit = BigInt(100000);
      rawTransaction.externalGasPrice = BigInt(
        Number(feeData.maxFeePerGas) * 2
      );
      rawTransaction.externalGasTip = BigInt(
        Number(feeData.maxPriorityFeePerGas) * 2
      );
      rawTransaction.type = 2;
    }

    const signedTransaction = await walletWithProvider.signTransaction(
      rawTransaction
    );

    // sendRawTransaction to quai node
    await sendRawTransaction(
      sendNodeData.provider,
      signedTransaction,
      value,
      receiveAddr
    );
    await sleep(interval);
    nonce++;
  }
  // end time
  const endTime = Date.now();
  const timeDiff = endTime - startTime;
  console.log("Time taken: ", timeDiff, "ms");
  console.log("Aggregated Balances: ", aggBalances);
}

async function sendRawTransaction(url, signedHexValue, value, receiveAddr) {
  try {
    const result = await axios.post(url, {
      jsonrpc: "2.0",
      method: "quai_sendRawTransaction",
      params: [signedHexValue],
      id: 1,
    });
    if (result.data.error) {
      console.log("Error: ", result.data.error.message);
      errors++;
    } else {
      if (aggBalances[receiveAddr] == undefined) {
        aggBalances[receiveAddr] = 0;
      }
      aggBalances[receiveAddr] += Number(value);
    }
  } catch (error) {
    errors++;
  }
}

function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s));
}

function logArgs(
  from: string,
  interval: number,
  total: number,
  loValue: number,
  hiValue: number,
  randomize: boolean
) {
  console.log("From: ", from);
  console.log("Interval: ", interval);
  console.log("Total: ", total);
  console.log("Low Value: ", loValue);
  console.log("High Value: ", hiValue);
  console.log("Randomize: ", randomize);
}

main();
