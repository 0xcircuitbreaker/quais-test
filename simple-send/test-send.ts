import { quais } from "quais";
import { allNodeData } from "../node-data";
import { typeFlag } from "type-flag";
import { getRandomAddressInShard } from "../shard-data";
import * as fs from "fs";

const parsed = typeFlag({
  from: {
    type: String,
    default: "zone-0-0",
    alias: "f",
  },
  chainID: {
    type: Number,
    default: 15000,
    alias: "c",
  },
  group: {
    type: String,
    default: "group-0",
    alias: "g",
  },
});

const inputFilePath = "../test_gen_alloc.json";

async function main() {
  const from = parsed.flags.from;
  const chainID = parsed.flags.chainID;
  const group = parsed.flags.group;

  const sendAddrData = allNodeData[from];
  if (sendAddrData == undefined) {
    console.log("Sending address not provided");
    return;
  }

  const sendNodeData = allNodeData[from];

  const provider = new quais.JsonRpcProvider(sendNodeData.provider);

  const genWallet = await fs.promises.readFile(inputFilePath, "utf8");

  const wallet = JSON.parse(genWallet);
  const shardKey = wallet[group][from][0];

  const walletWithProvider = new quais.Wallet(shardKey.privateKey, provider);

  const feeData = await provider.getFeeData();

  const receiveAddr = getRandomAddressInShard(from);
    const rawTransaction = {
      to: receiveAddr,
      value: BigInt(10000),
      gasLimit: BigInt(42000),
      maxFeePerGas: BigInt(Number(feeData.maxFeePerGas)),
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      type: 0,
      chainId: BigInt(chainID),
    } as quais.Transaction;

 

    const tx = await walletWithProvider.sendTransaction(rawTransaction);
    console.log("Transaction", tx);
}


main();
