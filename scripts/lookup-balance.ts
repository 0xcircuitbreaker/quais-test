import { quais } from "quais";
import { allNodeData } from "./node-data";
import { getFlag } from 'type-flag'
import { getShardFromAddress } from "./shard-data";

const address = getFlag("--address,-a", String);
async function main() {

    const shardData = getShardFromAddress(address as string)
    const sendNodeData = allNodeData[shardData[0].shard];

    const provider = new quais.providers.JsonRpcProvider(sendNodeData.provider);
    await provider.ready;

    const balanace = await provider.getBalance(address as string);
    console.log("Address: ", address)
    console.log("Balance: ", Number(balanace));
}

main();