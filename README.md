# Quais.js Test Suite

### Install and Setup

1. `git clone https://github.com/dominant-strategies/quais-test`
2. `cd quais-test`
3. `npm install`

Ensure you have ts-node installed globally:
`npm install -g ts-node`

### Usage

### 1. Latest block

Params:

- Chain to check (zone-0-0, prime, etc.)
  `ts-node scripts/latest-block.ts zone-1-2`

```
Height {
  number: '0x1',
  transactions: [],
  hash: '0x0000041f7518412cc22f9d183d43932da7744302cae67feff646b8fa943a6a16',
  parentHash: '0x0d926f32997f7a2b8a4157ed807c62306edc2547241a96a9ea2de6889126b7f0',
  timestamp: 1670018174,
  nonce: '0x2f27fbe57c371add',
  difficulty: '0x13880',
  _difficulty: '0x13880',
  gasLimit: '0x186a0',
  gasUsed: '0x0',
  miner: '0x0000000000000000000000000000000000000000',
  extraData: undefined,
  transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  stateRoot: '0x15ebf6410672eb37836f6c8bb2cce3023763f465c412c74e6c7d563f4612af9e',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
}
```

### 2. Get block

Get block will get a block at a given hash.
Params:

- Chain to check (zone-0-0, prime, etc.)
- Hash to lookup ("0x13df2...")
  `ts-node scripts/get-block.ts zone-0-0 0x0000041f7518412cc22f9d183d43932da7744302cae67feff646b8fa943a6a16`

Example expected result:

```
Block {
  number: '0x1',
  transactions: [],
  hash: '0x0000041f7518412cc22f9d183d43932da7744302cae67feff646b8fa943a6a16',
  parentHash: '0x0d926f32997f7a2b8a4157ed807c62306edc2547241a96a9ea2de6889126b7f0',
  timestamp: 1670018174,
  nonce: '0x2f27fbe57c371add',
  difficulty: '0x13880',
  _difficulty: '0x13880',
  gasLimit: '0x186a0',
  gasUsed: '0x0',
  miner: '0x0000000000000000000000000000000000000000',
  extraData: undefined,
  transactionsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
  stateRoot: '0x15ebf6410672eb37836f6c8bb2cce3023763f465c412c74e6c7d563f4612af9e',
  receiptsRoot: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
}
```

### 3. Lookup balance

Lookup balance will look up a balance on a chain for a given address. The address will be read from the address-data file.
Params:

- Addr to lookup ("0x1930e0b28d3766e895df661de871a9b8ab70a4da")
  `ts-node scripts/lookup-balance.ts -a zone-0-0`
  OR
  `ts-node scripts/lookup-balance.ts -a 0x1930e0b28d3766e895df661de871a9b8ab70a4da`

Example expected result:

```
Address 0x1930e0b28d3766e895df661de871a9b8ab70a4da
Balance:  0
```

### 4. Send Tx

Send tx will send a transaction from a context to an address. The address will be read from the address-data file. This script
can interpret internal to external transactions and add the external txData fields that trigger the ETx precompile.
Params:

- Addr to send from (z0-0, p-2, etc.)
- Value to send (100)

`ts-node scripts/send-tx.ts zone-0-0 zone-1-1 100`

# 5. Usage with SolidityX

Get the bytecode.
`solc --bin contracts/ETX.sol &> contracts/etx-compiled`
`solc --bin contracts/ERC20X.sol &> contracts/erc20x-compiled`
Or, with opcodes and binary:
`solc --pretty-json --bin --asm contracts/ETX.sol &> contracts/compiled`

Get the abi.
`solc --abi contracts/ETX.sol -o contracts`
`solc --abi contracts/ERC20X.sol -o contracts`

Solidity contracts
Params:

- Chain to send from (zone-0-0, prime, etc.)
- Addr to send from (z0-0, p-2, etc.)
  `ts-node scripts/deploy-etx.ts zone-0-0 zone-0-0`
  `ts-node scripts/deploy-erc20x.ts zone-0-0 zone-0-0`

### 6. Generate Addresses and Fuzz

`ts-node scripts/gen_addr/generate-addresses.ts`
This will output a genWallet.json that can be imported by `scripts/gen_addr/gen-fuzz-tx.ts`.
`generate-addresses.ts` also outputs a `network.txt` that can be imported into your `go-quai` network.env
Params:

```
    from: {
        type: String,
        default: "zone-0-0",
        alias: "f"
    },
    interval: {
        type: Number,
        default: 1000,
        alias: "i"
    },
    total: {
        type: Number,
        default: 10,
        alias: "t"
    },
    loValue: {
        type: Number,
        default: 1,
        alias: "l"
    },
    hiValue: {
        type: Number,
        default: 100,
        alias: "h"
    },
    addrList: {
        type: Boolean,
        default: false,
        alias: "a"
    },
    etxRatio: {
        type: Number,
        default: 0.5,
        alias: "e"
    },
    chainID: {
        type: Number,
        default: 15000,
        alias: "c"
    },
    destination: {
        type: String,
        default: null,
        alias: "d"
     },
     random: {
        type: Boolean,
        default: false,
        alias: "r"
     }
```

Example: `ts-node scripts/gen_addr/gen-fuzz-tx.ts --f zone-0-1 -i 100 -t 100 -l 50 -h 120`
