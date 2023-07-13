### Get block

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