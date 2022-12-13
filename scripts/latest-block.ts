import { quais } from "quais";
import { NodeData, allNodeData } from "./node-data";

;(async () => {

  var myArgs = process.argv.slice(2);
  var sendContext = myArgs[0];
  var data = allNodeData[sendContext] as NodeData;
  
  if (data == undefined) {
    console.log("Sending context not provided");
    return;
  }

  const provider = new quais.providers.JsonRpcProvider(data.provider);
  await provider.ready;

  const block = await provider.getBlock("latest");
  console.log("Height", block);
})();