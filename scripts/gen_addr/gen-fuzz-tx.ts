import { quais } from "quais";
import { allNodeData } from "../node-data";
import { addressList2, shardList } from "../address-list";
import { typeFlag } from 'type-flag'
import { getShardFromAddress } from "../shard-data";
import * as fs from 'fs';
import { CheckBalanceBackoff, RetryLimitExceededError } from "../../utils/rpc";
import { signTransactionWithOpenSSL } from "../../utils/wallet";
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
    }
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
    for(let i = 0; i < total; i++) {
        const value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        // try {
        //     await CheckBalanceBackoff(provider, walletWithProvider, value, 100, 1000, 10000);
        //   } catch (err) {
        //     if (err instanceof RetryLimitExceededError) {
        //       console.error("Failed after maximum retries:", err.message);
        //     } else {
        //       console.error("Unexpected error:", err);
        //     }
        //   }


        let receiveAddr;
        const sendExternal = Math.random() < parsed.flags.etxRatio;
        if(sendExternal) {
            // Get random shard from the list of shards
            const randomShard = slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
            const shardAddr = addressList2[randomShard];

            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
        } else {
            const shardAddr = addressList2[shardFrom.shard];
            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
        }

        
        const rawTransaction: quais.utils.UnsignedTransaction = {
            to: receiveAddr,
            value: quais.utils.parseEther('0.1'),
            nonce: 42,
            gasLimit: 21000,
            maxFeePerGas: quais.utils.parseUnits('10', 'gwei'),
            maxPriorityFeePerGas: quais.utils.parseUnits('10', 'gwei'),
            type: 0,
        };

        // start time
        // const startTime = new Date().getTime();
        const signedTransaction = await signTransactionWithOpenSSL(shardKey.privateKey, rawTransaction);
        // end time
        // const endTime = new Date().getTime();
        // console.log("Time taken to sign transaction: ", endTime - startTime, "ms");

        // sendRawTransaction to quai node
        const tx = await sendRawTransaction(sendNodeData.provider, "0x"+signedTransaction);
    
        // // sendRawTransaction to quai node
        // const tx = await provider.sendTransaction("0x"+signedTransaction);
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
      const response = await axios.post(url, {
        jsonrpc: '2.0',
        method: 'quai_sendRawTransaction',
        params: [signedHexValue],
        id: 1,
      });
      } catch (error) {
      console.error('Error sending raw transaction:', error.message);
    }
  }
  

async function sendTx(value: number, toAddress: string, walletWithProvider: any, nonce: number, shardFrom: any) {
    let txData = {
        to: toAddress,
        from: walletWithProvider.address,
        value: value,
    } as quais.providers.TransactionRequest;

    const shardTo = getShardFromAddress(toAddress)[0];

    // const feeData = await walletWithProvider.getFeeData() 
    // console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
    if(shardFrom != shardTo) {
        txData = {
            to: toAddress,
            from: walletWithProvider.address,
            value: value,
            externalGasLimit: 110000,
            externalGasPrice:  999999743 * 2,
            externalGasTip:  999999743 * 2,
            gasLimit: 100000,
            maxFeePerGas: 999999946,
            maxPriorityFeePerGas: 999999743,
            type: 2,
            nonce: nonce,
        };
    }

    try {
        
        const tx = await walletWithProvider.sendTransaction(txData);
        const time = new Date();
        // console.log("To", shardTo.shard, toAddress);
        // console.log("Hash", tx.hash);
        // console.log("Value", value);
        // console.log(time, "Nonce", nonce, "Hash", tx.hash);
        // console.log("");
        // console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
        
        if(aggBalances[toAddress] == undefined) {
            aggBalances[toAddress] = 0;
        }
        aggBalances[toAddress] += Number(value);
        } catch (e: any) {
            // console.log(e.reason);
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