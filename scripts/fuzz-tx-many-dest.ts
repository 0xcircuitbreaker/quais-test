import { quais } from "quais";
import { allNodeData } from "./node-data";
import { typeFlag } from 'type-flag'
import { getShardFromAddress } from "./shard-data";
import { readWallet } from "../utils/wallet";
import { addressList } from "./address-list";

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
    }
})

const aggBalances: { [key: string]: number } = {};

async function main() {
    
    const from = parsed.flags.from
    const interval = parsed.flags.interval
    const total = parsed.flags.total
    const loValue = parsed.flags.loValue
    const hiValue = parsed.flags.hiValue

    logArgs(from, interval, total, loValue, hiValue)
    
    const sendAddrData = allNodeData[from];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }


    const provider = new quais.providers.JsonRpcProvider(sendAddrData.provider);
    const walletWithProvider = await readWallet(provider, "genWallet.json", from);


    console.log("Sending Address: ", walletWithProvider.address)

    let nonce = await provider.getTransactionCount(walletWithProvider.address);
    for(let i = 0; i < total; i++) {
        const value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        const balanace = await provider.getBalance(walletWithProvider.address);
        console.log("Balance: ", Number(balanace));
        if(Number(balanace) < value) {
            console.log("Insufficient balance");
            return;
        }
        const receiveAddr = addressList[Math.floor(Math.random() * addressList.length)];
        await sendTx(value, receiveAddr, walletWithProvider, nonce);
        await sleep(interval);
        nonce++;
    }
    console.log("Aggregated Balances: ", aggBalances);
}

async function sendTx(value: number, toAddress: string, walletWithProvider: any, nonce: number) {
    let txData = {
        to: toAddress,
        from: walletWithProvider.address,
        value: value,
    } as quais.providers.TransactionRequest;

    const shardFrom = getShardFromAddress(walletWithProvider.address)[0];
    const shardTo = getShardFromAddress(toAddress)[0];

    console.log("toAddress: ", toAddress, " shardTo: ", shardTo)
    console.log("From: ", shardFrom, " To: ", shardTo, " Value: ", value)
    const feeData = await walletWithProvider.getFeeData() 
    console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
    if(shardFrom != shardTo) {
        txData = {
            to: toAddress,
            from: walletWithProvider.address,
            value: value,
            externalGasLimit: 110000,
            externalGasPrice:  Number(feeData.maxFeePerGas) * 2,
            externalGasTip:  Number(feeData.maxPriorityFeePerGas) * 2,
            gasLimit: 100000,
            maxFeePerGas: Number(feeData.maxFeePerGas),
            maxPriorityFeePerGas: Number(feeData.maxPriorityFeePerGas),
            type: 2,
            nonce: nonce,
        };
    }

    try {
        const tx = await walletWithProvider.sendTransaction(txData);
        console.log("Transaction sent", tx)
        if(aggBalances[toAddress] == undefined) {
            aggBalances[toAddress] = 0;
        }
        aggBalances[toAddress] += Number(value);
        } catch (e: any) {
            console.log(e.reason);
        }
        
}

function sleep(s: number) {
    return new Promise(resolve => setTimeout(resolve, s));
}

function logArgs(from: string, interval: number, total: number, loValue: number, hiValue: number) {
    console.log("From: ", from);
    console.log("Interval: ", interval);
    console.log("Total: ", total);
    console.log("Low Value: ", loValue);
    console.log("High Value: ", hiValue);
}

main();