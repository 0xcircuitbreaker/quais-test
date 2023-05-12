import { quais } from "quais";

const defaultHDPath = `m/44'/994'/0'/0`;

const shards = [
    "zone-0-0",
    "zone-0-1",
    "zone-0-2",
    "zone-1-0",
    "zone-1-1",
    "zone-1-2",
    "zone-2-0",
    "zone-2-1",
    "zone-2-2",
  ];
    
const QUAI_CONTEXTS = [
    {
        name: "Cyprus One",
        shard: "zone-0-0",
        context: 2,
        byte: ["0x00", "0x1D"]
    },
    {
        name: "Cyprus Two",
        shard: "zone-0-1",
        context: 2,
        byte: ["0x1E", "0x3A"]
    },
    {
        name: "Cyprus Three",
        shard: "zone-0-2",
        context: 2,
        byte: ["0x3B", "0x57"]
    },
    {
        name: "Paxos One",
        shard: "zone-1-0",
        context: 2,
        byte: ["0x58", "0x73"]
    },
    {
        name: "Paxos Two",
        shard: "zone-1-1",
        context: 2,
        byte: ["0x74", "0x8F"]
    },
    {
        name: "Paxos Three",
        shard: "zone-1-2",
        context: 2,
        byte: ["0x90", "0xAB"]
    },
    {
        name: "Hydra One",
        shard: "zone-2-0",
        context: 2,
        byte: ["0xAC", "0xC7"]
    },
    {
        name: "Hydra Two",
        shard: "zone-2-1",
        context: 2,
        byte: ["0xC8", "0xE3"]
    },
    {
        name: "Hydra Three",
        shard: "zone-2-2",
        context: 2,
        byte: ["0xE4", "0xFF"]
    }
  ];
  

function main() {
    const entropy = quais.utils.randomBytes(16);
    const HDNode = quais.utils.HDNode.fromSeed(entropy);
    for (const shard of shards) {
        const childNode = getChildNode(HDNode, defaultHDPath, 0, shard);
        console.log("Shard:", shard)
        console.log("ChildNode:", childNode)
    }
}

/**
 * Returns a derived address from a given HDKey. Options available
 * are path (defaults to the Quai 994 path) and index (defaults to 0).
 *
 * @param HDKey
 * @param opts
 * @returns
 */
function deriveChildKey(HDKey, opts) {
    const path = opts.path || defaultHDPath;
    const index = opts.index || 0;
  
    return HDKey.derivePath(path + "/" + index.toString());
  }
  
    
function getChildNode(hdnode, path, index, shard) {
    let found = false;
    let childNode;
    while (!found) {
        childNode = deriveChildKey(hdnode, { hdPath: path, index: index });
      const addrShard = getShardFromAddress(childNode.address);
      // Check if address is in a shard
      if (addrShard[0] !== undefined) {
        // Check if address is in correct shard
        if (addrShard[0].shard === shard) {
          found = true;
          break;
        }
      }
      index++;
    }
    return childNode;
  }
   
    
    export function getShardFromAddress(address: string) {
      return QUAI_CONTEXTS.filter((obj) => {
        const num = Number(address.substring(0, 4))
        const start = Number(obj.byte[0])
        const end = Number(obj.byte[1])
        return num >= start && num <= end
      })
    }
    
    
main();