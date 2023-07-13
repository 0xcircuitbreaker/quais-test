export const QUAI_CONTEXTS = [
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

  export function getShardFromAddress(address: string) {
    return QUAI_CONTEXTS.filter((obj) => {
      const num = Number(address.substring(0, 4))
      const start = Number(obj.byte[0])
      const end = Number(obj.byte[1])
      return num >= start && num <= end
    })
  }
  
  export function getRandomAddressInShard(shard: string) {
    const shardData = QUAI_CONTEXTS.filter((obj) => obj.shard === shard)
    const start = Number(shardData[0].byte[0])
    const end = Number(shardData[0].byte[1])
    let prefix =  Math.floor(Math.random() * (end - start + 1) + start).toString(16)
    // if prefix is only 1 character, add a 0 to the front
    if (prefix.length === 1) {
      prefix = "0" + prefix
    }
    let randomAddress = generateRandomAddress()
    // replace first 4 characters with random number between start and end
    randomAddress = randomAddress.replace(
      randomAddress.substring(2, 4),
      prefix
    )
    return randomAddress
  }


  // Generate a random Ethereum address
function generateRandomAddress() {
  const hexChars = '0123456789abcdef';
  let address = '0x';

  // Generate 40 random hexadecimal characters
  for (let i = 0; i < 40; i++) {
    const randomIndex = Math.floor(Math.random() * 16);
    address += hexChars[randomIndex];
  }

  return address;
}