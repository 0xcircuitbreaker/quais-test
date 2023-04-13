// import * as bip39 from "bip39"
import { getShardFromAddress, SigningKey, computeAddress } from "quais/lib/utils"
import { HDKey } from "@scure/bip32"
import { validateMnemonic, generateMnemonic, mnemonicToSeedSync } from "bip39"
import { quais } from "quais";
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, unlink, readFile } from 'fs/promises';
import  KeyEncoder from "key-encoder";

// Options:
export const defaultHDPath = `m/44'/994'/0'/0`

/**
 * Sets appropriate properties for the keyring based on the given
 * BIP39-compliant mnemonic.
 *
 * @param {string|Array<number>|Buffer} mnemonic - A seed phrase represented
 * as a string, an array of UTF-8 bytes, or a Buffer. Mnemonic input
 * passed as type buffer or array of UTF-8 bytes must be NFKD normalized.
 */
export function getWalletFromMnemonic(mnemonic) {
    // validate before initializing
    const isValid = validateMnemonic(mnemonic)
    if (!isValid) {
      throw new Error("Hd-Keyring: Invalid secret recovery phrase provided")
    }
  
    const seed = mnemonicToSeedSync(mnemonic)
    return HDKey.fromMasterSeed(seed)
  }


type AddressAndKey = {
    address: string,
    childKey: string 
}

/**
 * Returns a derived address from a given HDKey. Options available
 * are path (defaults to the Quai 994 path) and index (defaults to 0).
 *
 * @param HDKey
 * @param opts
 * @returns
 */
function deriveAddress(HDKey, opts)  {
    const path = opts.path || defaultHDPath
    const index = opts.index || 0
  
    const childKey = HDKey.derive(path + "/" + index.toString())
    const signingKey = new SigningKey(childKey.privateKey)
    const address = computeAddress(signingKey.publicKey)
    return { address: address, childKey: signingKey.privateKey }
}


export function grindAddress(keyfile, path, index, shard) {
    let found = false
    let newAddress = {} as AddressAndKey
    while (!found) {
      newAddress = deriveAddress(keyfile, { hdPath: path, index: index })
      const addrShard = getShardFromAddress(newAddress.address)
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


export async function generateRandomMnemonic() {
  return await generateMnemonic()
}

const execAsync = promisify(exec);

function privateKeyToPem(hexPrivateKey: string): string {
  const keyEncoder = new KeyEncoder("secp256k1")

  // remove 0x from hex string
  const rawPrivateKey = hexPrivateKey.slice(2) 
  const pemPrivateKey = keyEncoder.encodePrivate(rawPrivateKey, 'raw', 'pem')
  return pemPrivateKey;
}



export async function signTransactionWithOpenSSL(privateKey: string, rawTransaction: quais.utils.UnsignedTransaction): Promise<string> {
  // const privateKeyPem = privateKeyToPem(privateKey);
  const transaction = quais.utils.serializeTransaction(rawTransaction);
  const hash = quais.utils.keccak256(transaction);

  console.log("Transaction:", transaction)
  console.log("Hash:", hash)
  const privateKeyFile = 'private_key.pem';
  const signatureFile = 'signature.sig';

  try {
    // await writeFile(privateKeyFile, privateKeyPem);

    await execAsync(
      `echo -n '${hash}' | xxd -r -p | openssl dgst -sha256 -sign ${privateKeyFile} -out ${signatureFile} -hex`
    );
    const signature = await readFile(signatureFile, 'utf-8');
    // await unlink(privateKeyFile);
    await unlink(signatureFile);

    return signature.trim();
  } catch (error) {
    console.error('Error while signing transaction:', error);
    throw error;
  }
}

export const shards = [
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

export const shardToEnv = {
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
