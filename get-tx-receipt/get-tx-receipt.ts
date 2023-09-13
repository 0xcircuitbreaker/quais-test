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

  const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);

  const genWallet = await fs.promises.readFile(inputFilePath, "utf8");

  const wallet = JSON.parse(genWallet);
  const shardKey = wallet[group][from][0];

  const walletWithProvider = new quais.Wallet(shardKey.privateKey, provider);

  const receiveAddr = getRandomAddressInShard("zone-1-1");
  console.log(receiveAddr);
    const rawTransaction = {
        to: receiveAddr,
        value: quais.utils.parseEther('0.1'),
        gasLimit: 60000,
        type: 2,
        maxFeePerGas: quais.utils.parseUnits('10', 'gwei'),
        maxPriorityFeePerGas: quais.utils.parseUnits('10', 'gwei'),
        externalGasLimit: 60000,
        externalGasPrice: quais.utils.parseUnits('100', 'gwei'),
        externalGasTip: quais.utils.parseUnits('100', 'gwei'),
        chainId: 1337,
    };

    const tx = await walletWithProvider.sendTransaction(rawTransaction);

    provider.once(tx.hash, async (transaction) => {
        // Emitted when the transaction has been mined
        console.log("transaction", transaction)
        const receipt = await provider.getTransactionReceipt(tx.hash);
        console.log("Receipt", receipt);
    })

}


main();
