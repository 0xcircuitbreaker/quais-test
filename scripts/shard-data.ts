export const QUAI_CONTEXTS = [
    // {
    //   name: "Prime",
    //   shard: "prime",
    //   context: 0,
    //   byte: ["00", "09"]
    // },
    // {
    //   name: "Cyprus",
    //   shard: "region-0",
    //   context: 1,
    //   byte: ["0a", "13"]
    // },
    {
      name: "Cyprus One",
      shard: "zone-0-0",
      context: 2,
      byte: ["14", "1d"]
    },
    {
      name: "Cyprus Two",
      shard: "zone-0-1",
      context: 2,
      byte: ["1e", "27"]
    },
    {
      name: "Cyprus Three",
      shard: "zone-0-2",
      context: 2,
      byte: ["28", "31"]
    },
    // {
    //   name: "Paxos",
    //   shard: "region-1",
    //   context: 1,
    //   byte: ["32", "3b"]
    // },
    {
      name: "Paxos One",
      shard: "zone-1-0",
      context: 2,
      byte: ["3c", "45"]
    },
    {
      name: "Paxos Two",
      shard: "zone-1-1",
      context: 2,
      byte: ["46", "4f"]
    },
    {
      name: "Paxos Three",
      shard: "zone-1-2",
      context: 2,
      byte: ["50", "59"]
    },
    // {
    //   name: "Hydra",
    //   shard: "region-2",
    //   context: 1,
    //   byte: ["5a", "63"]
    // },
    {
      name: "Hydra One",
      shard: "zone-2-0",
      context: 2,
      byte: ["64", "6d"]
    },
    {
      name: "Hydra Two",
      shard: "zone-2-1",
      context: 2,
      byte: ["6e", "77"]
    },
    {
      name: "Hydra Three",
      shard: "zone-2-2",
      context: 2,
      byte: ["78", "81"]
    }
  ]

  export function getShardFromAddress(address: string) {
    return QUAI_CONTEXTS.filter((obj) => {
      const num = Number(address.substring(0, 4))
      const start = Number("0x" + obj.byte[0])
      const end = Number("0x" + obj.byte[1])
      return num >= start && num <= end
    })
  }
  
  export function getRandomAddressInShard(shard: string) {
    const shardData = QUAI_CONTEXTS.filter((obj) => obj.shard === shard)
    const start = Number("0x" + shardData[0].byte[0])
    const end = Number("0x" + shardData[0].byte[1])
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