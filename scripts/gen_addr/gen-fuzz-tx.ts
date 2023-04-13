import { quais } from "quais";
import { allNodeData } from "../node-data";
import { addressList2, shardList } from "../address-list";
import { typeFlag } from 'type-flag'
import { getShardFromAddress } from "../shard-data";
import * as fs from 'fs';
import { CheckBalanceBackoff, RetryLimitExceededError } from "../../utils/rpc";
import axios from "axios";

const parsed = typeFlag({
    from: {
        type: String,
        default: "zone-0-0",
        alias: "f"
    },
    interval: {
        type: Number,
        default: 1000,
        alias: "i"
    },
    total: {
        type: Number,
        default: 10,
        alias: "t"
    },
    loValue: {
        type: Number,
        default: 1,
        alias: "l"
    },
    hiValue: {
        type: Number,
        default: 100,
        alias: "h"
    },
    addrList: {
        type: Boolean,
        default: false,
        alias: "a"
    },
    etxRatio: {
        type: Number,
        default: 0.5,
        alias: "e"
    },
    chainID: {
        type: Number,
        default: 15000,
        alias: "c"
    },
})

const inputFilePath = 'genWallet.json';

const aggBalances: { [key: string]: number } = {};

async function main() {
    
    const from = parsed.flags.from
    const interval = parsed.flags.interval
    const total = parsed.flags.total
    const loValue = parsed.flags.loValue
    const hiValue = parsed.flags.hiValue
    const addrList = parsed.flags.addrList
    const etxRatio = parsed.flags.etxRatio
    const chainID = parsed.flags.chainID

    logArgs(from, interval, total, loValue, hiValue, addrList)
    
    const sendAddrData = allNodeData[from];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    const sendNodeData = allNodeData[from];

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);


    const genWallet = await fs.promises.readFile(inputFilePath, 'utf8')

    const wallet = JSON.parse(genWallet);
    const shardKey = wallet[from as any];
    const privKey = quais.utils.arrayify(shardKey.privateKey);
    const walletWithProvider = new quais.Wallet(privKey, provider);

    await provider.ready;

    console.log("Sending Address: ", walletWithProvider.address)

    let nonce = await provider.getTransactionCount(walletWithProvider.address);

    const shardFrom = getShardFromAddress(walletWithProvider.address)[0];
    const indexOfShard = shardList.indexOf(shardFrom.shard);

    const slicedShardList = shardList.slice(indexOfShard, indexOfShard + 2);

    // start time
    const startTime = Date.now();
    console.log("Starting nonce", nonce, "at", startTime);

    for(let i = 0; i < total; i++) {
        const value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        if (nonce % 100 == 0) {
            try {
                await CheckBalanceBackoff(provider, walletWithProvider, value, 100, 1000, 10000);
            } catch (err) {
                if (err instanceof RetryLimitExceededError) {
                console.error("Failed after maximum retries:", err.message);
                } else {
                console.error("Unexpected error:", err);
                }
            }
        }

        let receiveAddr;
        const sendExternal = Math.random() < etxRatio;
        if(sendExternal) {
            // Get random shard from the list of shards
            const randomShard = slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
            const shardAddr = addressList2[randomShard];

            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
        } else {
            const shardAddr = addressList2[shardFrom.shard];
            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
        }

        let type = 0;
        if (sendExternal) {
            type = 2;
        }

        const rawTransaction: quais.utils.UnsignedTransaction = {
            to: receiveAddr,
            value: quais.utils.parseEther('0.1'),
            nonce: nonce,
            gasLimit: 21000,
            maxFeePerGas: quais.utils.parseUnits('10', 'gwei'),
            maxPriorityFeePerGas: quais.utils.parseUnits('10', 'gwei'),
            type: type,
            chainId: chainID,
            externalGasPrice:  quais.utils.parseUnits('20', 'gwei'),
            externalGasTip:  quais.utils.parseUnits('20', 'gwei'),
        };
        
        const signedTransaction = await walletWithProvider.signTransaction(rawTransaction);

        // sendRawTransaction to quai node
        await sendRawTransaction(sendNodeData.provider, signedTransaction);
    
        await sleep(interval);
        nonce++;
    }
    // end time
    const endTime = Date.now();
    const timeDiff = endTime - startTime;
    console.log("Time taken: ", timeDiff, "ms");
    console.log("Aggregated Balances: ", aggBalances);
}

async function sendRawTransaction(url, signedHexValue) {
    try {
      await axios.post(url, {
        jsonrpc: '2.0',
        method: 'quai_sendRawTransaction',
        params: [signedHexValue],
        id: 1,
      });
      } catch (error) {
      console.error('Error sending raw transaction:', error.message);
    }
  }

function sleep(s: number) {
    return new Promise(resolve => setTimeout(resolve, s));
}

function logArgs(from: string, interval: number, total: number, loValue: number, hiValue: number, randomize: boolean) {
    console.log("From: ", from);
    console.log("Interval: ", interval);
    console.log("Total: ", total);
    console.log("Low Value: ", loValue);
    console.log("High Value: ", hiValue);
    console.log("Randomize: ", randomize);
}

main();