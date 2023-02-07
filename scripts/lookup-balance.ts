import { quais } from "quais";
import { AddressData, allAddressData } from "./coinbase-addresses";
import { NodeData, allNodeData } from "./node-data";
import { getFlag } from 'type-flag'
const { getShardFromAddress } = require("@quais/address")

let address = getFlag("--address,-a", String);
async function main() {
    var addrData = allAddressData[address as string] as AddressData;
    var sendNodeData
    if (addrData == undefined) {
      let shardData = getShardFromAddress(address as string)
      sendNodeData = allNodeData[shardData[0].shard];
    } else {
      sendNodeData = allNodeData[addrData.chain];
      address = addrData.address
    }

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    await provider.ready;

    const balanace = await provider.getBalance(address as string);
    console.log("Address: ", address)
    console.log("Balance: ", Number(balanace));
}

main();