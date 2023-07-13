import { env } from "process";
import {
  generateRandomMnemonic,
  getWalletFromMnemonic,
  grindAddress,
  defaultHDPath,
  shardToEnv,
  shardToName,
  shards,
} from "../utils/wallet";
import * as fs from "fs";

const genWallet = {};
const walletBalances = {};
const outputFilePath = "test_gen_alloc.json";
const envFilePath = "gen_alloc";

async function main() {
  if (fs.existsSync(envFilePath)) {
    fs.unlinkSync(envFilePath);
  }

  for (let i = 0; i < 12; i++) {
    genWallet["group-" + i] = {};
    for (let j = 0; j < 680; j++) {
      const mnemonic = await generateRandomMnemonic();
      const keyfile = getWalletFromMnemonic(mnemonic);
      for (const shard of shards) {
        const address = grindAddress(keyfile, defaultHDPath, 0, shard);
        //   genWallet["group-" + i][shard] = address;
        if (!genWallet["group-" + i][shard])
          genWallet["group-" + i][shard] = [];
        genWallet["group-" + i][shard] =
          genWallet["group-" + i][shard].concat(address);
        if (!walletBalances[shard]) walletBalances[shard] = {};
        walletBalances[shard][address.address] = { balance: "10000000000000000000000" };
      }
    }
  }

  fs.writeFile(outputFilePath, JSON.stringify(genWallet, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(`genWallet saved to ${outputFilePath}`);
    }
  });

  try {
    fs.mkdirSync("genallocs", { recursive: true });
  } catch (e) {
    console.log("Cannot create folder ", e);
  }

  for (const shard of shards) {
    fs.writeFile(
      "genallocs/" + envFilePath + "_" + shardToName[shard] + ".json",
      JSON.stringify(walletBalances[shard], null, 2),
      (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log(`genWallet saved to ${"genallocs/" + envFilePath + "_" + shardToName[shard] + ".json"}`);
        }
      }
    );
  }
}

main();
