//load 'quais' and 'fs'
import { quais } from "quais";
import { allNodeData } from "./node-data";
import { allAddressData } from "./coinbase-addresses"
import { getShardFromAddress } from "./shard-data"

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
    var bytecode = "60806040526000806000806000600180620186a06706f05b59d3b20000735a457339697cb56e5a9bfa5267ea80d2c6375d986000f690505060698060446000396000f3fe6080604052600080fdfea264697066735822122048e125ec447a897915e034dd8d5c5295f59dd458bb031f38518bd59acc02c08864736f6c63782c302e382e31382d646576656c6f702e323032322e31312e382b636f6d6d69742e36306161353861362e6d6f64005d";
    //Read abi file to object; names of the solcjs-generated files renamed
    var abi = JSON.parse(fs.readFileSync('contracts/ERC20X.abi').toString());
    
    //to create 'signer' object;here 'account'
    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    const wallet = await quais.Wallet.fromEncryptedJson(sendAddrData.keystore, "");
    const walletWithProvider = new quais.Wallet(wallet.privateKey, provider);
    await provider.ready;
    
    var salt;
    var initCodeBytes;
    const nonce = await provider.getTransactionCount(sendAddrData.address);
    const nonceBytes = quais.utils.formatBytes32String(nonce.toString());
    var found = false;
    
    while(!found) {
        // replace last two bytes of bytecode with salt
        salt = quais.utils.randomBytes(1);
        var initCode = bytecode.substring(0, bytecode.length-2).concat(toHexString(salt));

        initCodeBytes = toByteArray(initCode);

        console.log("BYTECODE", bytecode)
        console.log("INITCODEBYTES", toHexString(initCodeBytes))

        var addressAndNonce = quais.utils.concat([sendAddrData.address, nonceBytes])
        var createInput = new Uint8Array([ ...addressAndNonce, ...initCodeBytes]);

        console.log(createInput)
        var preComputedAddress = quais.utils.getAddress(quais.utils.hexDataSlice(quais.utils.keccak256(createInput), 12))
        var shard = getShardFromAddress(preComputedAddress)
        console.log("PRECOMPUTED ADDRESS", preComputedAddress)
        if(shard[0] == undefined) {
            continue 
        }
        if (shard[0].shard == sendAddrData.chain) {
            found = true
        }
    }

    const myContract = new quais.ContractFactory(abi, toHexString(initCodeBytes), walletWithProvider);

    // If your contract requires constructor args, you can specify them here
    const contract = await myContract.deploy({ gasLimit: 99999 });
    
    console.log(contract.address);
    console.log(contract.deployTransaction);
}

//convert bytes to hex string
function toHexString(byteArray: any) {
    return Array.from(byteArray, function(byte: any) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

// convert hex string to bytes
function toByteArray(hexString: any) {
    var result = [] as any;
    while (hexString.length >= 2) {
        result.push(parseInt(hexString.substring(0, 2), 16));
        hexString = hexString.substring(2, hexString.length);
    }
    return result;
}

main();