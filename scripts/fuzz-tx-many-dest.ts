import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./coinbase-addresses"
import { addressList } from "./address-list";
import { typeFlag } from 'type-flag'
import { getShardFromAddress } from "./shard-data";

const parsed = typeFlag({
    from: {
        type: String,
        default: "zone-0-0",
        alias: "f"
    },
    interval: {
        type: Number,
        default: 1,
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
    randomize: {
        type: Boolean,
        default: false,
        alias: "r"
    }
})

const aggBalances: { [key: string]: number } = {};

async function main() {
    
    let from = parsed.flags.from
    let interval = parsed.flags.interval
    let total = parsed.flags.total
    let loValue = parsed.flags.loValue
    let hiValue = parsed.flags.hiValue
    let randomize = parsed.flags.randomize

    logArgs(from, interval, total, loValue, hiValue, randomize)
    
    var sendAddrData = allAddressData[from];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var sendNodeData = allNodeData[sendAddrData.chain];

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");

    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);

    await provider.ready;

    console.log("Sending Address: ", wallet.address)

    for(var i = 0; i < total; i++) {
        var value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        const balanace = await provider.getBalance(wallet.address);
        console.log("Balance: ", Number(balanace));
        if(Number(balanace) < value) {
            console.log("Insufficient balance");
            return;
        }
        var receiveAddr;
        if(randomize) {
            receiveAddr = addressList[Math.floor(Math.random() * addressList.length)];
        } else {
            receiveAddr = Object.keys(allAddressData)[Math.floor(Math.random() * Object.keys(allAddressData).length)];
        }
        await sendTx(value, receiveAddr, sendAddrData, walletWithProvider);
        await sleep(interval);
    }
    console.log("Aggregated Balances: ", aggBalances);
}

async function sendTx(value: number, toAddress: string, sendAddrData: any, walletWithProvider: any) {
    var txData = {
        to: toAddress,
        from: sendAddrData.address,
        value: value,
    } as quais.providers.TransactionRequest;

    let shardFrom = getShardFromAddress(sendAddrData.address)[0];
    let shardTo = getShardFromAddress(toAddress)[0];

    console.log("From: ", shardFrom.shard, " To: ", shardTo.shard, " Value: ", value)

    if(shardFrom != shardTo) {
        txData = {
            to: toAddress,
            from: sendAddrData.address,
            value: value,
            externalGasLimit: 110000,
            externalGasPrice: 10000000000,
            externalGasTip:  10000000000,
            gasLimit: 100000,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            type: 2,
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
    return new Promise(resolve => setTimeout(resolve, s * 1000));
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