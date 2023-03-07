import { quais } from "quais";
import { CYPRUS_FAUCET } from "./keystore/faucet-cyprus1";

async function main() {
    const provider = new quais.providers.JsonRpcProvider("https://rpc.cyprus1.colosseum.quaiscan.io");
    const wallet = await quais.Wallet.fromEncryptedJson(CYPRUS_FAUCET, "");

    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);

    await provider.ready;


    console.log("Address", wallet.address)
    // normal transaction

    const balanace = await provider.getBalance(wallet.address);

    console.log("Balance: ", balanace);

    const to = "0x246ae82bb49e9dda583cb5fd304fd31cc1b69790";

    const toShard = quais.utils.getShardFromAddress(to);
    const fromShard = quais.utils.getShardFromAddress(wallet.address)

    var txData = {
        to: to,
        value: 100000,
    } as quais.providers.TransactionRequest;


    if(toShard != fromShard) {
        var feeData = await walletWithProvider.getFeeData() 
        console.log("Fee Data: ", Number(feeData.maxFeePerGas), Number(feeData.maxPriorityFeePerGas))
        if(toShard != fromShard) {
            txData = {
                to: to,
                from: wallet.address,
                value: 10000,
                externalGasLimit: 110000,
                externalGasPrice:  Number(feeData.maxFeePerGas) * 2,
                externalGasTip:  Number(feeData.maxPriorityFeePerGas) * 2,
                gasLimit: 100000,
                maxFeePerGas: Number(feeData.maxFeePerGas),
                maxPriorityFeePerGas: Number(feeData.maxPriorityFeePerGas),
                type: 2,
            };
        }
    }

    try {
        const tx = await walletWithProvider.sendTransaction(txData);
        console.log("Transaction sent", tx)
    } catch (e: any) {
        console.log(e.reason);
    }
}

main();