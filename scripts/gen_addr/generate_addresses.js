// import * as bip39 from "bip39"
const { getShardFromAddress, SigningKey, computeAddress } = require("quais/lib/utils")
const { HDKey } = require("@scure/bip32")
const {validateMnemonic, generateMnemonic, mnemonicToSeedSync} = require('bip39')
const fs = require('fs')
const { quais } = require("quais")

// Options:
const defaultHDPath = `m/44'/994'/0'/0`

/**
 * Sets appropriate properties for the keyring based on the given
 * BIP39-compliant mnemonic.
 *
 * @param {string|Array<number>|Buffer} mnemonic - A seed phrase represented
 * as a string, an array of UTF-8 bytes, or a Buffer. Mnemonic input
 * passed as type buffer or array of UTF-8 bytes must be NFKD normalized.
 */
function getWalletFromMnemonic(mnemonic) {
    // validate before initializing
    const isValid = validateMnemonic(mnemonic)
    if (!isValid) {
      throw new Error("Hd-Keyring: Invalid secret recovery phrase provided")
    }
  
    // eslint-disable-next-line node/no-sync
    const seed = mnemonicToSeedSync(mnemonic)
    return HDKey.fromMasterSeed(seed)
  }

  

/**
 * Returns a derived address from a given HDKey. Options available
 * are path (defaults to the Quai 994 path) and index (defaults to 0).
 *
 * @param HDKey
 * @param opts
 * @returns
 */
function deriveAddress(HDKey, opts) {
    let path = opts.path || defaultHDPath
    let index = opts.index || 0
  
    let childKey = HDKey.derive(path + "/" + index.toString())
    let signingKey = new SigningKey(childKey.privateKey)
    let address = computeAddress(signingKey.publicKey)
    return { address: address, childKey: signingKey.privateKey }
}


function grindAddress(keyfile, path, index, shard) {
    let found = false
    let newAddress = ""
    while (!found) {
      newAddress = deriveAddress(keyfile, { hdPath: path, index: index })
      let addrShard = getShardFromAddress(newAddress.address)
        // Check if address is in a shard
      if (addrShard !== undefined) {
        // Check if address is in correct shard
        if (addrShard === shard) {
          found = true
          break
        }
      }
      index++
    }
    return {
      address: newAddress.address,
      index: index,
      path: path + "/" + index.toString(),
      privateKey: quais.utils.hexlify(newAddress.childKey)
    }
}

    
async function generateRandomMnemonic() {
return await generateMnemonic()
}

const shards = [
    "prime",
    "region-0",
    "zone-0-0",
    "zone-0-1",
    "zone-0-2",
    "region-1",
    "zone-1-0",
    "zone-1-1",
    "zone-1-2",
    "region-2",
    "zone-2-0",
    "zone-2-1",
    "zone-2-2",
]

const shardToEnv = {
    "prime": "PRIME_COINBASE",
    "region-0": "REGION_0_COINBASE",
    "zone-0-0": "ZONE_0_0_COINBASE",
    "zone-0-1": "ZONE_0_1_COINBASE",
    "zone-0-2": "ZONE_0_2_COINBASE",
    "region-1": "REGION_1_COINBASE",
    "zone-1-0": "ZONE_1_0_COINBASE",
    "zone-1-1": "ZONE_1_1_COINBASE",
    "zone-1-2": "ZONE_1_2_COINBASE",
    "region-2": "REGION_2_COINBASE",
    "zone-2-0": "ZONE_2_0_COINBASE",
    "zone-2-1": "ZONE_2_1_COINBASE",
    "zone-2-2": "ZONE_2_2_COINBASE",
}


const genWallet = {};

const outputFilePath = 'genWallet.json';
const envFilePath = 'network.env';

async function main() {
    let mnemonic = await generateRandomMnemonic()
    let keyfile = getWalletFromMnemonic(mnemonic)


    for (let shard of shards) {
        let address = grindAddress(keyfile, defaultHDPath, 0, shard)
        genWallet[shard] = address
        fs.appendFile(envFilePath, `${shardToEnv[shard]}=${address.address}\n`, function (err) {
          if (err) throw err;
        });
    }
    fs.writeFile(outputFilePath, JSON.stringify(genWallet, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log(`genWallet saved to ${outputFilePath}`);
      }
    });
}

main()