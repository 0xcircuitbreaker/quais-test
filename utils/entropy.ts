import { quais } from "quais";

const accountHDPath = `m/44'/994'/0'/0`;

function main() {
    const entropy = quais.utils.randomBytes(16);
    const HDNode = quais.utils.HDNode.fromSeed(entropy);
    const childNodes = quais.utils.getAllShardsAddressChildNode(HDNode, accountHDPath);
    for (const node of childNodes) {
      console.log(node)
    }
     
}

    
main();