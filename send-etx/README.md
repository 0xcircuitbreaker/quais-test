### ETX Transaction Script
This script is for deploying a smart contract to a blockchain network. It uses the quais library (as an assumption as no official link provided for quais) for interaction with the blockchain network, the type-flag library for parsing command line arguments, and the fs module for interacting with the file system.

Prerequisites
Before you can run this script, you must install Node.js and npm. Once you have installed these, run the following command to install the necessary libraries:

```bash
npm install quais type-flag
```
Ensure you have the contract's ABI and bytecode. The ABI file should be named 'ETX.abi' and be in a directory named 'contract'.

Usage
The script can be configured via command line flags:

-f or --from: the zone from which the transaction is to be sent. Defaults to zone-0-0.
-g or --group: the group of the wallet key to be used for the transaction. Defaults to group-0.
To deploy a contract from zone-0-1 using group group-1, you would run:

```bash
ts-node deploy-etx.ts -f zone-0-1 -g group-1
```
The script will then:

Load the node data from a predefined allNodeData object based on the from argument.
Connect to the blockchain network using the provider from the node data.
Read the wallet data from a file named test_gen_alloc.json.
Select a private key from the wallet data based on the group and from arguments.
Read the contract's ABI and bytecode from local files.
Create a new contract factory with the ABI, bytecode, and wallet.
Deploy the contract with a gas limit of 99999.
Log the contract's details.