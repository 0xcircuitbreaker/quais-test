import { quais } from "quais";
import { NodeData, allNodeData } from "./node-data";

(async () => {

  const myArgs = process.argv.slice(2);
  const sendContext = myArgs[0];
  const data = allNodeData[sendContext] as NodeData;
  
  if (data == undefined) {
    console.log("Sending context not provided");
    return;
  }

  const provider = new quais.JsonRpcProvider(data.provider);
  await provider.ready;

  const block = await provider.getBlock("latest");
  console.log("Height", block);
})();