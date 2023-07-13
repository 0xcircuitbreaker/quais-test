import { quais } from "quais";
import { allNodeData } from "../node-data";
import { typeFlag } from "type-flag";
import * as fs from "fs";

const parsed = typeFlag({
  from: {
    type: String,
    default: "zone-0-0",
    alias: "f",
  },
  group: {
    type: String,
    default: "group-0",
    alias: "g",
  },
});

const inputFilePath = "../test_gen_alloc.json";


async function main() {
  const from = parsed.flags.from;
  const group = parsed.flags.group;

  const sendAddrData = allNodeData[from];
  if (sendAddrData == undefined) {
    console.log("Sending address not provided");
    return;
  }

  const sendNodeData = allNodeData[from];


  const provider = new quais.JsonRpcProvider(sendNodeData.provider);

  const genWallet = await fs.promises.readFile(inputFilePath, "utf8");

  const wallet = JSON.parse(genWallet);
  const shardKey = wallet[group][from][0];

  const walletWithProvider = new quais.Wallet(shardKey.privateKey, provider);

  // Paste bytecode from etx-compiled after solc run
  const bytecode = "60806040526040518060400160405280600a81526020017f5465737420546f6b656e00000000000000000000000000000000000000000000815250600090816200004a919062000392565b506040518060400160405280600281526020017f54540000000000000000000000000000000000000000000000000000000000008152506001908162000091919062000392565b506012600260006101000a81548160ff021916908360ff1602179055506b033b2e3c9fd0803ce8000000600355348015620000cb57600080fd5b50600354600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555062000479565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806200019a57607f821691505b602082108103620001b057620001af62000152565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200021a7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82620001db565b620002268683620001db565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620002736200026d62000267846200023e565b62000248565b6200023e565b9050919050565b6000819050919050565b6200028f8362000252565b620002a76200029e826200027a565b848454620001e8565b825550505050565b600090565b620002be620002af565b620002cb81848462000284565b505050565b5b81811015620002f357620002e7600082620002b4565b600181019050620002d1565b5050565b601f82111562000342576200030c81620001b6565b6200031784620001cb565b8101602085101562000327578190505b6200033f6200033685620001cb565b830182620002d0565b50505b505050565b600082821c905092915050565b6000620003676000198460080262000347565b1980831691505092915050565b600062000382838362000354565b9150826002028217905092915050565b6200039d8262000118565b67ffffffffffffffff811115620003b957620003b862000123565b5b620003c5825462000181565b620003d2828285620002f7565b600060209050601f8311600181146200040a5760008415620003f5578287015190505b62000401858262000374565b86555062000471565b601f1984166200041a86620001b6565b60005b8281101562000444578489015182556001820191506020850194506020810190506200041d565b8683101562000464578489015162000460601f89168262000354565b8355505b6001600288020188555050505b505050505050565b610e0680620004896000396000f3fe608060405234801561001057600080fd5b50600436106100935760003560e01c8063313ce56711610066578063313ce5671461013457806370a082311461015257806395d89b4114610182578063a9059cbb146101a0578063dd62ed3e146101d057610093565b806306fdde0314610098578063095ea7b3146100b657806318160ddd146100e657806323b872dd14610104575b600080fd5b6100a0610200565b6040516100ad9190610985565b60405180910390f35b6100d060048036038101906100cb9190610a40565b61028e565b6040516100dd9190610a9b565b60405180910390f35b6100ee610380565b6040516100fb9190610ac5565b60405180910390f35b61011e60048036038101906101199190610ae0565b610386565b60405161012b9190610a9b565b60405180910390f35b61013c610678565b6040516101499190610b4f565b60405180910390f35b61016c60048036038101906101679190610b6a565b61068b565b6040516101799190610ac5565b60405180910390f35b61018a6106a3565b6040516101979190610985565b60405180910390f35b6101ba60048036038101906101b59190610a40565b610731565b6040516101c79190610a9b565b60405180910390f35b6101ea60048036038101906101e59190610b97565b6108d0565b6040516101f79190610ac5565b60405180910390f35b6000805461020d90610c06565b80601f016020809104026020016040519081016040528092919081815260200182805461023990610c06565b80156102865780601f1061025b57610100808354040283529160200191610286565b820191906000526020600020905b81548152906001019060200180831161026957829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161036e9190610ac5565b60405180910390a36001905092915050565b60035481565b600081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101561040a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161040190610c83565b60405180910390fd5b81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156104c9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104c090610cef565b60405180910390fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105189190610d3e565b9250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461056e9190610d72565b9250508190555081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546106019190610d3e565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516106659190610ac5565b60405180910390a3600190509392505050565b600260009054906101000a900460ff1681565b60046020528060005260406000206000915090505481565b600180546106b090610c06565b80601f01602080910402602001604051908101604052809291908181526020018280546106dc90610c06565b80156107295780601f106106fe57610100808354040283529160200191610729565b820191906000526020600020905b81548152906001019060200180831161070c57829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156107b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107ac90610c83565b60405180910390fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108049190610d3e565b9250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461085a9190610d72565b925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516108be9190610ac5565b60405180910390a36001905092915050565b6005602052816000526040600020602052806000526040600020600091509150505481565b600081519050919050565b600082825260208201905092915050565b60005b8381101561092f578082015181840152602081019050610914565b60008484015250505050565b6000601f19601f8301169050919050565b6000610957826108f5565b6109618185610900565b9350610971818560208601610911565b61097a8161093b565b840191505092915050565b6000602082019050818103600083015261099f818461094c565b905092915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006109d7826109ac565b9050919050565b6109e7816109cc565b81146109f257600080fd5b50565b600081359050610a04816109de565b92915050565b6000819050919050565b610a1d81610a0a565b8114610a2857600080fd5b50565b600081359050610a3a81610a14565b92915050565b60008060408385031215610a5757610a566109a7565b5b6000610a65858286016109f5565b9250506020610a7685828601610a2b565b9150509250929050565b60008115159050919050565b610a9581610a80565b82525050565b6000602082019050610ab06000830184610a8c565b92915050565b610abf81610a0a565b82525050565b6000602082019050610ada6000830184610ab6565b92915050565b600080600060608486031215610af957610af86109a7565b5b6000610b07868287016109f5565b9350506020610b18868287016109f5565b9250506040610b2986828701610a2b565b9150509250925092565b600060ff82169050919050565b610b4981610b33565b82525050565b6000602082019050610b646000830184610b40565b92915050565b600060208284031215610b8057610b7f6109a7565b5b6000610b8e848285016109f5565b91505092915050565b60008060408385031215610bae57610bad6109a7565b5b6000610bbc858286016109f5565b9250506020610bcd858286016109f5565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610c1e57607f821691505b602082108103610c3157610c30610bd7565b5b50919050565b7f4e6f7420656e6f75676820746f6b656e73000000000000000000000000000000600082015250565b6000610c6d601183610900565b9150610c7882610c37565b602082019050919050565b60006020820190508181036000830152610c9c81610c60565b9050919050565b7f4e6f7420656e6f75676820616c6c6f77616e6365000000000000000000000000600082015250565b6000610cd9601483610900565b9150610ce482610ca3565b602082019050919050565b60006020820190508181036000830152610d0881610ccc565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610d4982610a0a565b9150610d5483610a0a565b9250828203905081811115610d6c57610d6b610d0f565b5b92915050565b6000610d7d82610a0a565b9150610d8883610a0a565b9250828201905080821115610da057610d9f610d0f565b5b9291505056fea26469706673582212202575cd13a936ed0e1ad5061a6d3d56bc0aa7365f594a28c5c3c9520d784ec4e864736f6c63782c302e382e31382d646576656c6f702e323032322e31312e382b636f6d6d69742e36306161353861362e6d6f64005d";
  //Read abi file to object; names of the solcjs-generated files renamed
  const abi = JSON.parse(fs.readFileSync('contract/ERC20X.abi').toString());
  
  const myContract = new quais.ContractFactory(abi, bytecode, walletWithProvider);
  
  // If your contract requires constructor args, you can specify them here
  const contract = await myContract.deploy({ gasLimit: 500000 });
  
  console.log(contract);
}
    
main();