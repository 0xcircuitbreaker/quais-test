### Simple Transaction
This script randomly generates and sends transactions to different nodes in a network. It utilizes the quais library (as an assumption as no official link provided for quais) for interacting with the blockchain network and the type-flag library for parsing command line arguments.

Prerequisites
Before you can run this script, you must install Node.js and npm. Once you have installed these, run the following command to install the necessary libraries:

```bash
npm install quais type-flag
```
The script can be configured via command line flags:

-f or --from: the zone from which the transaction is to be sent. Defaults to zone-0-0.
-c or --chainID: the ID of the blockchain network chain to send the transaction. Defaults to 15000.
-g or --group: the group of the wallet key to be used for the transaction. Defaults to group-0.
For example, to send a transaction from zone-0-1 on chain 16000 using group group-1, you would run:

```bash
ts-node test-send.ts -f zone-0-1 -c 16000 -g group-1
```
Replace <script-name> with the name of this script.

The script will then:

Load the node data from a predefined allNodeData object based on the from argument.
Connect to the blockchain network using the provider from the node data.
Read the wallet data from a file named test_gen_alloc.json.
Select a private key from the wallet data based on the group and from arguments.
Get the fee data from the provider.
Generate a random address in the same shard as the from argument.
Construct a raw transaction to the random address with a value of 10000 and a gas limit of 42000.
Send the transaction and log the result.
Note
Please make sure that the file test_gen_alloc.json is present in the same directory and is correctly formatted. This file should contain the wallet data needed to sign the transactions.