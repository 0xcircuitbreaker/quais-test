import { env } from "process";
import {
  generateRandomMnemonic,
  getWalletFromMnemonic,
  grindAddress,
  defaultHDPath,
  shardToEnv,
  shardToName,
  shards,
} from "./wallet";
import * as fs from "fs";
import { quais } from "quais";

const genWallet = {};
const walletBalances = {};
const outputFilePath = "test_gen_alloc.json";
const envFilePath = "gen_alloc";

async function main() {

    // read test_gen_alloc.json
    const genWallet = await fs.promises.readFile(outputFilePath, "utf8");
    // get group-0
    const group0 = JSON.parse(genWallet)["group-0"];
    
    let shardWallets = [];
    // get each of the shards
    for (const shard of shards) {
        const shardWallet = group0[shard];
        let keystores = [];
        // first 20 of shardWallet
        let first20 = shardWallet.slice(0, 1);
        for (const wallet of first20) {
            let quaisWallet = new quais.Wallet(wallet.privateKey)
            let keystore = await quaisWallet.encrypt("")
            keystores.push(keystore)
        }
        console.log(keystores)
        shardWallets.push({shard: shard, keystores: keystores})
    }

    // write to keystores.json
    fs.writeFile("keystores.json", JSON.stringify(shardWallets, null, 2), (err) => {
        if (err) {
            console.error("Error writing file:", err);
        } else {
            console.log(`keystores saved to keystores.json`);
        }
    }
    );
}

main();
