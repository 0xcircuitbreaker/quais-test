//load 'quais' and 'fs'
import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./coinbase-addresses"
const { grindContractAddress } = require("@quais/address")

const fs = require('fs');

//Ussing async-await for deploy method
async function main() {

    var myArgs = process.argv.slice(2);

    var sendAddrData = allAddressData[ myArgs[0]];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    var sendNodeData = allNodeData[sendAddrData.chain];
        
    
    // Paste bytecode from etx-compiled after solc run
    // ENSURE THAT BYTECODE IS ALWAYS 0x-prefixed
    var bytecode = "0x60806040526000806000806000600180620186a06706f05b59d3b20000735a457339697cb56e5a9bfa5267ea80d2c6375d986000f690505060698060446000396000f3fe6080604052600080fdfea264697066735822122048e125ec447a897915e034dd8d5c5295f59dd458bb031f38518bd59acc02c08864736f6c63782c302e382e31382d646576656c6f702e323032322e31312e382b636f6d6d69742e36306161353861362e6d6f64005d";
    //Read abi file to object; names of the solcjs-generated files renamed
    var abi = JSON.parse(fs.readFileSync('contracts/ERC20X.abi').toString());
    
    //to create 'signer' object;here 'account'
    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");
    const walletWithProvider = new quais.Wallet("0x24ae8967e4e0e15b4b2c69ef93a6d6ebc199405f46c93dbfd43d99d730235a95", provider);
    await provider.ready;
    
    // TODO: Fix the ability to retrieve the right nonce.
    console.log("walletWithProvider.address", walletWithProvider.address)
    const nonce = await provider.getTransactionCount(sendAddrData.address);
    const contractBytes = await grindContractAddress(nonce, "zone-0-0", walletWithProvider.address, bytecode)
    console.log("contractBytes", contractBytes);

    const myContract = new quais.ContractFactory(abi, contractBytes, walletWithProvider);

    // If your contract requires constructor args, you can specify them here
    const contract = await myContract.deploy({ gasLimit: 99999 });
    
    console.log("CA", contract.address);
    console.log("DATA", contract.deployTransaction);
}

main();