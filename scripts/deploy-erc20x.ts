//load 'quais' and 'fs'
import { quais } from "quais";
import { allNodeData } from "./node-data";
import { readWallet } from "../utils/wallet";
import * as fs from 'fs';

//Ussing async-await for deploy method
async function main() {

    const myArgs = process.argv.slice(2);

    const from = myArgs[0]
    const sendAddrData = allNodeData[from];
    if (sendAddrData == undefined) {
        console.log("Sending address not provided");
        return;
    }

    // Paste bytecode from etx-compiled after solc run
    const bytecode = "60806040526000806000806000600180620186a06706f05b59d3b20000735a457339697cb56e5a9bfa5267ea80d2c6375d986000f690505060698060446000396000f3fe6080604052600080fdfea264697066735822122048e125ec447a897915e034dd8d5c5295f59dd458bb031f38518bd59acc02c08864736f6c63782c302e382e31382d646576656c6f702e323032322e31312e382b636f6d6d69742e36306161353861362e6d6f64005d";
    //Read abi file to object; names of the solcjs-generated files renamed
    const abi = JSON.parse(fs.readFileSync('contracts/ERC20X.abi').toString());
    
    //to create 'signer' object;here 'account'
    const provider = new quais.providers.JsonRpcProvider(sendAddrData.provider);
    const walletWithProvider = await readWallet(provider, "genWallet.json", from)
    const myContract = new quais.ContractFactory(abi, bytecode, walletWithProvider);
    
    // If your contract requires constructor args, you can specify them here
    const contract = await myContract.deploy({ gasLimit: 500000 });
    
    console.log(contract.address);
    console.log(contract.deployTransaction);
}
    
main();