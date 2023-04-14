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
    destination: {
        type: String,
        default: null,
        alias: "d"
     }
})

const inputFilePath = 'genWallet.json';

const aggBalances: { [key: string]: number } = {};
let errors = 0;

async function main() {
    
    const from = parsed.flags.from
    const interval = parsed.flags.interval
    const total = parsed.flags.total
    const loValue = parsed.flags.loValue
    const hiValue = parsed.flags.hiValue
    const addrList = parsed.flags.addrList
    const etxRatio = parsed.flags.etxRatio
    const chainID = parsed.flags.chainID
    const destination = parsed.flags.destination

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
    // Remove indexOfShard from the list
    const slicedShardList = shardList.slice(0, indexOfShard).concat(shardList.slice(indexOfShard + 1, shardList.length));


    // start time
    const startTime = Date.now();
    console.log("Starting nonce", nonce, "at", startTime);

    for(let i = 0; i < total; i++) {
        const value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        if (nonce % 100 == 0) {
            console.log("Nonce", nonce, "elapsed", Date.now() - startTime, "total errors", errors);
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
        let sendExternal = false;

        // If we have a destination, send to an address in that destination
        if (destination) {
            const shardAddr = addressList2[destination];
            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
            if (shardFrom.shard != destination) {
                sendExternal = true;
            }
        } else {
            // If we don't have a destination, send to an address in a random shard
            // depending on the etxRatio
            sendExternal = Math.random() < etxRatio;
            if(sendExternal) {
                // Get random shard from the list of shards
                const randomShard = slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
                const shardAddr = addressList2[randomShard];

                receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
            } else {
                const shardAddr = addressList2[shardFrom.shard];
                receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
            }
        }
    
        // const feeData = await walletWithProvider.getFeeData() 
        // console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))

        // console.log("quais.utils.parseUnits('1000', 'gwei')", quais.utils.parseUnits('1000', 'gwei'))
        // console.log("ChainID", chainID, "Nonce", nonce, "Value", value, "Type", type, "From", walletWithProvider.address, "To", receiveAddr)
        // const rawTransaction: quais.utils.UnsignedTransaction = {
        //     to: receiveAddr,
        //     value: value,
        //     nonce: nonce,
        //     gasLimit: 21000,
        //     maxFeePerGas: quais.utils.parseUnits('1000', 'gwei'),
        //     maxPriorityFeePerGas: quais.utils.parseUnits('1', 'gwei'),
        //     type: type,
        //     chainId: chainID,
        // };

        // if (sendExternal) {
        //     rawTransaction.externalGasLimit = quais.BigNumber.from(100000);
        //     rawTransaction.externalGasPrice = quais.utils.parseUnits('1000', 'gwei');
        //     rawTransaction.externalGasTip = quais.utils.parseUnits('1000', 'gwei');
        // }
        
        // console.log("Is External", sendExternal, type)
        // console.log(rawTransaction)
        // const signedTransaction = await walletWithProvider.signTransaction(rawTransaction);

        // // sendRawTransaction to quai node
        // await sendRawTransaction(sendNodeData.provider, signedTransaction);
        const feeData = await walletWithProvider.getFeeData() 

        const txData = {
            to: receiveAddr,
            from: walletWithProvider.address,
            value: value,
            gasLimit: 21000,
            maxFeePerGas: Number(feeData.maxFeePerGas),
            maxPriorityFeePerGas: Number(feeData.maxPriorityFeePerGas),
            nonce: nonce,
        } as quais.providers.TransactionRequest;
 
        if(sendExternal) {
            txData.externalGasLimit = 110000;
            txData.gasLimit = 110000;
            txData.externalGasPrice =  Number(feeData.maxFeePerGas) * 2;
            txData.externalGasTip =  Number(feeData.maxPriorityFeePerGas) * 2;
            txData.type = 2;
        }

    try {
        const tx = await walletWithProvider.sendTransaction(txData);
        if(aggBalances[receiveAddr] == undefined) {
            aggBalances[receiveAddr] = 0;
        }
        aggBalances[receiveAddr] += Number(value);
        } catch (e: any) {
            console.log(e.reason);
        }

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
      const result = await axios.post(url, {
        jsonrpc: '2.0',
        method: 'quai_sendRawTransaction',
        params: [signedHexValue],
        id: 1,
      });
      if (result.data.error) {
        errors++;
      }
      } catch (error) {
        errors++;
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