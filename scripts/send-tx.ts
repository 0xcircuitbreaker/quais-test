import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./address-data"

async function main() {

    var myArgs = process.argv.slice(2);
    var sendContext = myArgs[0];
    var sendNodeData = allNodeData[sendContext];
    if (sendNodeData == undefined) {
        console.log("Sending context not provided");
        return;
    }

    var sendAddr = myArgs[1];
    var sendAddrData = allAddressData[sendAddr];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var receiveAddr = myArgs[2];
    var receiveAddrData = allAddressData[receiveAddr];
    if (receiveAddrData == undefined) {
        console.log("Receiving context not provided");
        return;
    }
    var toAddress = sendAddrData.address;

    var value = myArgs[3];
    if (value == undefined) {
        console.log("Value not provided");
        return
    }

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");

    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);

    await provider.ready;


    console.log("Address", wallet.address)
    // normal transaction

    const balanace = await provider.getBalance(wallet.address);

    console.log("Balance: ", balanace);

    var txData = {
        to: toAddress,
        from: sendAddrData.address,
        value: value,
    } as quais.providers.TransactionRequest;

    console.log(receiveAddrData, sendAddrData)
    if(receiveAddrData.range != sendAddrData.range) {
        txData = {
            to: toAddress,
            from: sendAddrData.address,
            value: 100,
            externalGasLimit: 10,
            externalGasPrice: 10,
            externalGasTip:  10,
        };
    }

    console.log(txData)

    const tx = await walletWithProvider.sendTransaction(txData);

    console.log({
        tx,
    });
}

main();