import { quais } from "quais";
import { AddressData, allAddressData } from "./address-data";
import { NodeData, allNodeData } from "./node-data";

async function main() {

    var myArgs = process.argv.slice(2);
    var addr = myArgs[0];
    var addrData = allAddressData[addr] as AddressData;
    
    if (addrData == undefined) {
      console.log("Address not provided");
      return;
    }
    var sendNodeData = allNodeData[addrData.chain];

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    await provider.ready;

    const balanace = await provider.getBalance(addrData.address);
    console.log("Address", addrData.address)
    console.log("Balance: ", Number(balanace));
}

main();