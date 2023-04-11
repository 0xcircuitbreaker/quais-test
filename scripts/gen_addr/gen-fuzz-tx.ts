import { quais } from "quais";
import { allNodeData } from "../node-data";
import { allAddressData } from "../coinbase-addresses"
import { addressList } from "../address-list";
import { typeFlag } from 'type-flag'
import { getShardFromAddress } from "../shard-data";
import * as fs from 'fs';

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
    }
})

const inputFilePath = 'genWallet.json';

const aggBalances: { [key: string]: number } = {};

async function main() {
    
    let from = parsed.flags.from
    let interval = parsed.flags.interval
    let total = parsed.flags.total
    let loValue = parsed.flags.loValue
    let hiValue = parsed.flags.hiValue
    let addrList = parsed.flags.addrList

    logArgs(from, interval, total, loValue, hiValue, addrList)
    
    var sendAddrData = allAddressData[from];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var sendNodeData = allNodeData[sendAddrData.chain];

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);


    const genWallet = await fs.promises.readFile(inputFilePath, 'utf8')

    let wallet = JSON.parse(genWallet);
    let shardKey = wallet[sendAddrData.chain as any];
    let privKey = quais.utils.arrayify(shardKey.privateKey);
    const walletWithProvider = new quais.Wallet(privKey, provider);

    await provider.ready;

    console.log("Sending Address: ", walletWithProvider.address)

    var nonce = await provider.getTransactionCount(walletWithProvider.address);
    for(var i = 0; i < total; i++) {
        var value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);

        const balanace = await provider.getBalance(walletWithProvider.address);
        console.log("Balance: ", Number(balanace));
        if(Number(balanace) < value) {
            console.log("Insufficient balance");
            return;
        }
        var receiveAddr;
        if(addrList) {
            receiveAddr = addressList[Math.floor(Math.random() * addressList.length)];
        } else {
            var receiveData = Object.keys(allAddressData)[Math.floor(Math.random() * Object.keys(allAddressData).length)];
            receiveAddr = allAddressData[receiveData].address;
        }
        await sendTx(value, receiveAddr, sendAddrData, walletWithProvider, nonce);
        await sleep(interval);
        nonce++;
    }
    console.log("Aggregated Balances: ", aggBalances);
}

async function sendTx(value: number, toAddress: string, sendAddrData: any, walletWithProvider: any, nonce: number) {
    var txData = {
        to: toAddress,
        from: walletWithProvider.address,
        value: value,
    } as quais.providers.TransactionRequest;

    let shardFrom = getShardFromAddress(sendAddrData.address)[0];
    let shardTo = getShardFromAddress(toAddress)[0];


    var feeData = await walletWithProvider.getFeeData() 
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
        
        console.log("toAddress: ", toAddress, " shardTo: ", shardTo)
        console.log("From: ", shardFrom, " To: ", shardTo, " Value: ", value)
        console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
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

function logArgs(from: string, interval: number, total: number, loValue: number, hiValue: number, randomize: boolean) {
    console.log("From: ", from);
    console.log("Interval: ", interval);
    console.log("Total: ", total);
    console.log("Low Value: ", loValue);
    console.log("High Value: ", hiValue);
    console.log("Randomize: ", randomize);
}

main();