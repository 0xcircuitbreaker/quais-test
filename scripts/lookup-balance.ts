import { quais } from "quais";
import { AddressData, allAddressData } from "./address-data";
import { NodeData, allNodeData } from "./node-data";

async function main() {

    var myArgs = process.argv.slice(2);
    var sendContext = myArgs[0];
    var data = allNodeData[sendContext] as NodeData;
    
    if (data == undefined) {
      console.log("Context not provided");
      return;
    }

    var addr = myArgs[0];
    var addrData = allAddressData[addr] as AddressData;
    
    if (addrData == undefined) {
      console.log("Address not provided");
      return;
    }

    const provider = new quais.providers.JsonRpcProvider(data.provider);
    await provider.ready;

    const balanace = await provider.getBalance(addrData.address);
    console.log("Address", addrData.address)
    console.log("Balance: ", Number(balanace));
}

main();