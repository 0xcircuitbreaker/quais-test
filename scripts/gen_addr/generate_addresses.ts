import { generateRandomMnemonic, getWalletFromMnemonic, grindAddress, defaultHDPath, shardToEnv, shards } from '../../utils/wallet';
import * as fs from 'fs';

const genWallet = {};

const outputFilePath = 'genWallet.json';
const envFilePath = 'network.env';

async function main() {
    const mnemonic = await generateRandomMnemonic()
    const keyfile = getWalletFromMnemonic(mnemonic)

    for (const shard of shards) {
        const address = grindAddress(keyfile, defaultHDPath, 0, shard)
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