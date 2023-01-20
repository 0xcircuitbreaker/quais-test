import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./address-data"

async function main() {

    var myArgs = process.argv.slice(2);

    var sendAddr = myArgs[0];
    var sendAddrData = allAddressData[sendAddr];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var sendNodeData = allNodeData[sendAddrData.chain];


    var total = myArgs[1];
    if (total == undefined) {
        console.log("total num not provided");
        return
    }
    var totalNum = parseInt(total);

    var timeDiff = myArgs[2];
    if (timeDiff == undefined) {
        console.log("timeDiff not provided");
        return
    }
    var timeDiffNum = parseInt(timeDiff);

    var valRange1 = myArgs[3];
    if (valRange1 == undefined) {
        console.log("valRange1 not provided");
        return
    }
    var valRange1Num = parseInt(valRange1);


    var valRange2 = myArgs[4];
    if (valRange2 == undefined) {
        console.log("valRange2 not provided");
        return
    }
    var valRange2Num = parseInt(valRange2);

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");

    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);

    await provider.ready;

    const balanace = await provider.getBalance(wallet.address);
    console.log("Address", wallet.address)
    console.log("Balance: ", balanace);


    for(var i = 0; i < totalNum; i++) {
        var value = Math.floor(Math.random() * (valRange2Num - valRange1Num + 1) + valRange1Num);
        var receiveAddr = Object.keys(allAddressData)[Math.floor(Math.random() * Object.keys(allAddressData).length)];
        var receiveAddrData = allAddressData[receiveAddr];
        var toAddress = receiveAddrData.address;
        await sendTx(value, toAddress, sendAddrData, receiveAddrData, walletWithProvider);
        await sleep(timeDiffNum);
    }
}

async function sendTx(value: number, toAddress: string, sendAddrData: any, receiveAddrData: any, walletWithProvider: any) {
    var txData = {
        to: toAddress,
        from: sendAddrData.address,
        value: value,
    } as quais.providers.TransactionRequest;


    if(receiveAddrData.range != sendAddrData.range) {
        txData = {
            to: toAddress,
            from: sendAddrData.address,
            value: 1,
            externalGasLimit: 110000,
            externalGasPrice: 2000000000,
            externalGasTip:  2000000000,
            gasLimit: 1000000,
            maxFeePerGas: 1,
            maxPriorityFeePerGas: 1,
            type: 2,
        };
    }

    try {
        const tx = await walletWithProvider.sendTransaction(txData);
        console.log("Transaction sent", tx)
        } catch (e: any) {
            console.log(e.reason);
        }
}

function sleep(s: number) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}
main();