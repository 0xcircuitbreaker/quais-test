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
    receive: {
        type: String,
        default: "0x22d0767679532b23718Ea2cc8A4A3b4Aa9e1536c",
        alias: "r"
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
})

const aggBalances: { [key: string]: number } = {};

async function main() {
    
    let from = parsed.flags.from
    let receive = parsed.flags.receive
    let interval = parsed.flags.interval
    let total = parsed.flags.total
    let loValue = parsed.flags.loValue
    let hiValue = parsed.flags.hiValue

    logArgs(from, receive, interval, total, loValue, hiValue)
    
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
        await sendTx(value, receive, sendAddrData, walletWithProvider);
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

    console.log("From: ", shardFrom.shard, " To: ", shardTo.shard, " Value: ", value)
    var feeData = await walletWithProvider.getFeeData() 
    console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
    if(shardFrom != shardTo) {
        txData = {
            to: toAddress,
            from: sendAddrData.address,
            value: value,
            externalGasLimit: 110000,
            externalGasPrice:  Number(feeData.maxFeePerGas) * 2,
            externalGasTip:  Number(feeData.maxPriorityFeePerGas) * 2,
            gasLimit: 100000,
            maxFeePerGas: Number(feeData.maxFeePerGas),
            maxPriorityFeePerGas: Number(feeData.maxPriorityFeePerGas),
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
    return new Promise(resolve => setTimeout(resolve, s));
}

function logArgs(from: string, to: string, interval: number, total: number, loValue: number, hiValue: number) {
    console.log("From: ", from);
    console.log("Receive Address: ", to);
    console.log("Interval: ", interval);
    console.log("Total: ", total);
    console.log("Low Value: ", loValue);
    console.log("High Value: ", hiValue);
}

main();