import { quais } from "quais";

const phrase = quais.Mnemonic.fromEntropy(quais.randomBytes(32));
const wallet = quais.HDNodeWallet.fromMnemonic(phrase);

console.log("phrase:", phrase);
console.log("wallet.address:", wallet.address);
console.log("wallet.mnemonic.phrase:", wallet.mnemonic.phrase);
console.log("wallet.privateKey:", wallet.privateKey);
