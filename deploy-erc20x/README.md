### Deploy-ERC20X Script README
Description
This is a script to deploy an ERC20 token to a specified blockchain node. It reads a JSON file containing wallet data, creates a new instance of the token with specified initial supply and then deploys it to the blockchain. It makes use of the quais and type-flag libraries.

Dependencies
Node.js
quais
type-flag
fs
How to Use
Clone the repository.

Install the necessary dependencies by running the following command in your terminal:

```
npm install
```
Run the script with the following command:

```
ts-node deploy-erc20x.ts --from zone --group group
```
where zone and group are the node and group you want to deploy the contract to. By default, these are "zone-0-0" and "group-0" respectively.

Flags
from (-f): Node to deploy from. Default is "zone-0-0".
group (-g): Group to deploy to. Default is "group-0".
File Structure
deploy-erc20.js : The main script that deploys the ERC20 token.
../node-data : Contains data for all nodes. The script uses this data to find the sender's address and the node to deploy to.
../test_gen_alloc.json : A JSON file containing wallet data for testing.
Additional Information
The main() function in the script is asynchronous and uses the await keyword to handle Promises. It reads the wallet data from the JSON file and uses the quais library to create a wallet with a specified shard key. Then it compiles and deploys the token to the blockchain.

Please note that the bytecode for the ERC20 contract is hardcoded in the script and may need to be updated to deploy a different ERC20 token contract.