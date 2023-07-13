"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var quais_1 = require("quais");
var node_data_1 = require("../node-data");
var address_list_1 = require("../address-list");
var type_flag_1 = require("type-flag");
var shard_data_1 = require("../shard-data");
var fs = require("fs");
var rpc_1 = require("../../utils/rpc");
var axios_1 = require("axios");
var parsed = (0, type_flag_1.typeFlag)({
    from: {
        type: String,
        default: "zone-0-0",
        alias: "f",
    },
    interval: {
        type: Number,
        default: 1000,
        alias: "i",
    },
    total: {
        type: Number,
        default: 10,
        alias: "t",
    },
    loValue: {
        type: Number,
        default: 1,
        alias: "l",
    },
    hiValue: {
        type: Number,
        default: 100,
        alias: "h",
    },
    addrList: {
        type: Boolean,
        default: false,
        alias: "a",
    },
    etxRatio: {
        type: Number,
        default: 0.5,
        alias: "e",
    },
    chainID: {
        type: Number,
        default: 15000,
        alias: "c",
    },
    destination: {
        type: String,
        default: null,
        alias: "d",
    },
    random: {
        type: Boolean,
        default: false,
        alias: "r",
    },
    increaseIntervalDelay: {
        type: Number,
        default: 0,
        alias: "I",
    },
    intervalArray: {
        type: [Number],
        default: [0],
        alias: "A",
    },
    memPoolSize: {
        type: Number,
        default: 15000,
        alias: "m",
    },
    group: {
        type: String,
        default: "group-0",
        alias: "g",
    },
});
var inputFilePath = "test_gen_alloc.json";
var aggBalances = {};
var errors = 0;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var from, interval, total, loValue, hiValue, addrList, etxRatio, chainID, destination, random, increaseIntervalDelay, intervalArray, mempoolSize, group, sendAddrData, sendNodeData, provider, genWallet, wallet, shardKeys, walletsWithNonce, _i, shardKeys_1, shardKey, walletWithProvider, nonce, indexOfShard, slicedShardList, feeData, startTime, intervalIndex, walletIndex, totalTxs, activeWallet, nonce, value, err_1, receiveAddr, sendExternal, shardAddr, randomShard, randomShard, shardAddr, shardAddr, rawTransaction, signedTransaction, endTime, timeDiff;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    from = parsed.flags.from;
                    interval = parsed.flags.interval;
                    total = parsed.flags.total;
                    loValue = parsed.flags.loValue;
                    hiValue = parsed.flags.hiValue;
                    addrList = parsed.flags.addrList;
                    etxRatio = parsed.flags.etxRatio;
                    chainID = parsed.flags.chainID;
                    destination = parsed.flags.destination;
                    random = parsed.flags.random;
                    increaseIntervalDelay = parsed.flags.increaseIntervalDelay;
                    intervalArray = parsed.flags.intervalArray;
                    mempoolSize = parsed.flags.memPoolSize;
                    group = parsed.flags.group;
                    logArgs(from, interval, total, loValue, hiValue, addrList);
                    sendAddrData = node_data_1.allNodeData[from];
                    if (sendAddrData == undefined) {
                        console.log("Sending address not provided");
                        return [2 /*return*/];
                    }
                    sendNodeData = node_data_1.allNodeData[from];
                    provider = new quais_1.quais.JsonRpcProvider(sendNodeData.provider);
                    return [4 /*yield*/, fs.promises.readFile(inputFilePath, "utf8")];
                case 1:
                    genWallet = _a.sent();
                    wallet = JSON.parse(genWallet);
                    shardKeys = wallet[group][from];
                    walletsWithNonce = [];
                    _i = 0, shardKeys_1 = shardKeys;
                    _a.label = 2;
                case 2:
                    if (!(_i < shardKeys_1.length)) return [3 /*break*/, 5];
                    shardKey = shardKeys_1[_i];
                    walletWithProvider = new quais_1.quais.Wallet(shardKey.privateKey, provider);
                    console.log("Sending Address: ", walletWithProvider.address);
                    return [4 /*yield*/, provider.getTransactionCount(walletWithProvider.address, "pending")];
                case 3:
                    nonce = _a.sent();
                    walletsWithNonce.push({ wallet: walletWithProvider, nonce: nonce });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    indexOfShard = address_list_1.shardList.indexOf(from);
                    slicedShardList = address_list_1.shardList
                        .slice(0, indexOfShard)
                        .concat(address_list_1.shardList.slice(indexOfShard + 1, address_list_1.shardList.length));
                    return [4 /*yield*/, provider.getFeeData()];
                case 6:
                    feeData = _a.sent();
                    startTime = Date.now();
                    intervalIndex = 0;
                    interval = intervalArray[intervalIndex];
                    intervalIndex++;
                    walletIndex = 0;
                    totalTxs = 0;
                    _a.label = 7;
                case 7:
                    if (!true) return [3 /*break*/, 19];
                    activeWallet = walletsWithNonce[walletIndex];
                    walletIndex++;
                    if (walletIndex == walletsWithNonce.length) {
                        walletIndex = 0;
                    }
                    nonce = activeWallet.nonce;
                    if (increaseIntervalDelay > 0) {
                        if (intervalArray.length != intervalIndex) {
                            if (Date.now() - startTime > increaseIntervalDelay) {
                                console.log("Changing interval delay to", intervalArray[intervalIndex], "ms");
                                interval = intervalArray[intervalIndex];
                                intervalIndex++;
                            }
                        }
                    }
                    value = Math.floor(Math.random() * (hiValue - loValue + 1) + loValue);
                    if (!(totalTxs % 2000 == 0)) return [3 /*break*/, 13];
                    console.log("totalTxs", totalTxs, "elapsed", Date.now() - startTime, "total errors", errors);
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, (0, rpc_1.CheckBalanceBackoff)(provider, activeWallet.wallet, value, 100, 1000, 10000)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, provider.getFeeData()];
                case 10:
                    feeData = _a.sent();
                    return [4 /*yield*/, provider.getTransactionCount(activeWallet.wallet.address, "pending")];
                case 11:
                    nonce = _a.sent();
                    activeWallet.nonce = nonce;
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _a.sent();
                    if (err_1 instanceof rpc_1.RetryLimitExceededError) {
                        console.error("Failed after maximum retries:", err_1.message);
                    }
                    else {
                        console.error("Unexpected error:", err_1);
                    }
                    return [3 /*break*/, 13];
                case 13:
                    if (!(totalTxs % mempoolSize == 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, (0, rpc_1.CheckMempoolBackoff)(sendNodeData.provider, mempoolSize, 100, 5000, 10000)];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    receiveAddr = void 0;
                    sendExternal = false;
                    // If we have a destination, send to an address in that destination
                    if (destination) {
                        shardAddr = address_list_1.addressList2[destination];
                        receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
                        if (from != destination) {
                            sendExternal = true;
                        }
                    }
                    else if (random) {
                        // If we don't have a destination and are sending to a random address,
                        // calculate the from ratio and send to an address in a random shard depending on the etxRatio.
                        sendExternal = Math.random() < etxRatio;
                        if (sendExternal) {
                            randomShard = slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
                            receiveAddr = (0, shard_data_1.getRandomAddressInShard)(randomShard);
                        }
                        else {
                            receiveAddr = (0, shard_data_1.getRandomAddressInShard)(from);
                        }
                    }
                    else {
                        // If we don't have a destination and we aren't sending to a random address,
                        // send to an address in a random shard depending on the etxRatio
                        sendExternal = Math.random() < etxRatio;
                        if (sendExternal) {
                            randomShard = slicedShardList[Math.floor(Math.random() * slicedShardList.length)];
                            shardAddr = address_list_1.addressList2[randomShard];
                            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
                        }
                        else {
                            shardAddr = address_list_1.addressList2[from];
                            receiveAddr = shardAddr[Math.floor(Math.random() * shardAddr.length)];
                        }
                    }
                    rawTransaction = {
                        to: receiveAddr,
                        value: BigInt(value),
                        nonce: nonce,
                        gasLimit: BigInt(42000),
                        maxFeePerGas: BigInt(Number(feeData.maxFeePerGas) * 2),
                        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
                        type: 0,
                        chainId: BigInt(chainID),
                    };
                    if (sendExternal) {
                        rawTransaction.externalGasLimit = BigInt(100000);
                        rawTransaction.externalGasPrice = BigInt(Number(feeData.maxFeePerGas) * 2);
                        rawTransaction.externalGasTip = BigInt(Number(feeData.maxPriorityFeePerGas) * 2);
                        rawTransaction.type = 2;
                    }
                    return [4 /*yield*/, activeWallet.wallet.signTransaction(rawTransaction)];
                case 16:
                    signedTransaction = _a.sent();
                    // sendRawTransaction to quai node
                    return [4 /*yield*/, sendRawTransaction(sendNodeData.provider, signedTransaction, value, receiveAddr)];
                case 17:
                    // sendRawTransaction to quai node
                    _a.sent();
                    return [4 /*yield*/, sleep(interval)];
                case 18:
                    _a.sent();
                    activeWallet.nonce++;
                    totalTxs++;
                    return [3 /*break*/, 7];
                case 19:
                    endTime = Date.now();
                    timeDiff = endTime - startTime;
                    console.log("Time taken: ", timeDiff, "ms");
                    console.log("Aggregated Balances: ", aggBalances);
                    return [2 /*return*/];
            }
        });
    });
}
function sendRawTransaction(url, signedHexValue, value, receiveAddr) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.post(url, {
                            jsonrpc: "2.0",
                            method: "quai_sendRawTransaction",
                            params: [signedHexValue],
                            id: 1,
                        })];
                case 1:
                    result = _a.sent();
                    if (result.data.error) {
                        console.log("Error: ", result.data.error.message);
                        errors++;
                    }
                    else {
                        if (aggBalances[receiveAddr] == undefined) {
                            aggBalances[receiveAddr] = 0;
                        }
                        aggBalances[receiveAddr] += Number(value);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    errors++;
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function sleep(s) {
    return new Promise(function (resolve) { return setTimeout(resolve, s); });
}
function logArgs(from, interval, total, loValue, hiValue, randomize) {
    console.log("From: ", from);
    console.log("Interval: ", interval);
    console.log("Total: ", total);
    console.log("Low Value: ", loValue);
    console.log("High Value: ", hiValue);
    console.log("Randomize: ", randomize);
}
main();
