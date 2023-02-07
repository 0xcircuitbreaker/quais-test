import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./coinbase-addresses"

async function main() {

    var myArgs = process.argv.slice(2);

    var sendAddr = myArgs[0];
    var sendAddrData = allAddressData[sendAddr];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var sendNodeData = allNodeData[sendAddrData.chain];

    var receiveAddr = myArgs[1];
    var receiveAddrData = allAddressData[receiveAddr];
    if (receiveAddrData == undefined) {
        console.log("Receiving context not provided");
        return;
    }
    var toAddress = receiveAddrData.address;

    var value = myArgs[2];
    if (value == undefined) {
        console.log("Value not provided");
        return
    }

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");

    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);

    await provider.ready;

    provider.on("pending", (txHash) => {
        if (txHash) {
            process.stdout.write(`[${(new Date).toLocaleTimeString()}] Scanning transactions: ${txHash} \r`);
        }
    });

    console.log("Address", wallet.address)
    // normal transaction

    const balanace = await provider.getBalance(wallet.address);

    console.log("Balance: ", balanace);

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

main();