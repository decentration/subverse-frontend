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
exports.SubstrateApp = void 0;
var common_1 = require("./common");
var SubstrateApp = /** @class */ (function () {
    function SubstrateApp(transport, cla, slip0044) {
        if (!transport) {
            throw new Error('Transport has not been defined');
        }
        this.transport = transport;
        this.cla = cla;
        this.slip0044 = slip0044;
    }
    SubstrateApp.serializePath = function (slip0044, account, change, addressIndex) {
        if (!Number.isInteger(account))
            throw new Error('Input must be an integer');
        if (!Number.isInteger(change))
            throw new Error('Input must be an integer');
        if (!Number.isInteger(addressIndex))
            throw new Error('Input must be an integer');
        var buf = Buffer.alloc(20);
        buf.writeUInt32LE(0x8000002c, 0);
        buf.writeUInt32LE(slip0044, 4);
        buf.writeUInt32LE(account, 8);
        buf.writeUInt32LE(change, 12);
        buf.writeUInt32LE(addressIndex, 16);
        return buf;
    };
    SubstrateApp.GetChunks = function (message) {
        var chunks = [];
        var buffer = Buffer.from(message);
        for (var i = 0; i < buffer.length; i += common_1.CHUNK_SIZE) {
            var end = i + common_1.CHUNK_SIZE;
            if (i > buffer.length) {
                end = buffer.length;
            }
            chunks.push(buffer.slice(i, end));
        }
        return chunks;
    };
    SubstrateApp.signGetChunks = function (slip0044, account, change, addressIndex, message) {
        var chunks = [];
        var bip44Path = SubstrateApp.serializePath(slip0044, account, change, addressIndex);
        chunks.push(bip44Path);
        chunks.push.apply(chunks, SubstrateApp.GetChunks(message));
        return chunks;
    };
    SubstrateApp.prototype.getVersion = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, common_1.getVersion)(this.transport, this.cla)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, (0, common_1.processErrorResponse)(e_1)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SubstrateApp.prototype.appInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.transport.send(0xb0, 0x01, 0, 0).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        var appName = '';
                        var appVersion = '';
                        var flagLen = 0;
                        var flagsValue = 0;
                        if (response[0] !== 1) {
                            // Ledger responds with format ID 1. There is no spec for any format != 1
                            return {
                                return_code: 0x9001,
                                error_message: 'response format ID not recognized',
                            };
                        }
                        else {
                            var appNameLen = response[1];
                            appName = response.slice(2, 2 + appNameLen).toString('ascii');
                            var idx = 2 + appNameLen;
                            var appVersionLen = response[idx];
                            idx += 1;
                            appVersion = response.slice(idx, idx + appVersionLen).toString('ascii');
                            idx += appVersionLen;
                            var appFlagsLen = response[idx];
                            idx += 1;
                            flagLen = appFlagsLen;
                            flagsValue = response[idx];
                        }
                        return {
                            return_code: returnCode,
                            error_message: (0, common_1.errorCodeToString)(returnCode),
                            // //
                            appName: appName ? appName : 'err',
                            appVersion: appVersion ? appVersion : 'err',
                            flagLen: flagLen,
                            flagsValue: flagsValue,
                            // eslint-disable-next-line no-bitwise
                            flag_recovery: (flagsValue & 1) !== 0,
                            // eslint-disable-next-line no-bitwise
                            flag_signed_mcu_code: (flagsValue & 2) !== 0,
                            // eslint-disable-next-line no-bitwise
                            flag_onboarded: (flagsValue & 4) !== 0,
                            // eslint-disable-next-line no-bitwise
                            flag_pin_validated: (flagsValue & 128) !== 0,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.getAddress = function (account, change, addressIndex, requireConfirmation, scheme) {
        if (requireConfirmation === void 0) { requireConfirmation = false; }
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var bip44Path, p1, p2;
            return __generator(this, function (_a) {
                bip44Path = SubstrateApp.serializePath(this.slip0044, account, change, addressIndex);
                p1 = 0;
                if (requireConfirmation)
                    p1 = 1;
                p2 = 0;
                if (!isNaN(scheme))
                    p2 = scheme;
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.GET_ADDR, p1, p2, bip44Path).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var errorCode = errorCodeData[0] * 256 + errorCodeData[1];
                        return {
                            pubKey: response.slice(0, 32).toString('hex'),
                            address: response.slice(32, response.length - 2).toString('ascii'),
                            return_code: errorCode,
                            error_message: (0, common_1.errorCodeToString)(errorCode),
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.signSendChunk = function (chunkIdx, chunkNum, chunk, scheme) {
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var payloadType, p2;
            return __generator(this, function (_a) {
                payloadType = common_1.PAYLOAD_TYPE.ADD;
                if (chunkIdx === 1) {
                    payloadType = common_1.PAYLOAD_TYPE.INIT;
                }
                if (chunkIdx === chunkNum) {
                    payloadType = common_1.PAYLOAD_TYPE.LAST;
                }
                p2 = 0;
                if (!isNaN(scheme))
                    p2 = scheme;
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.SIGN, payloadType, p2, chunk, [common_1.ERROR_CODE.NoError, 0x6984, 0x6a80]).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        var errorMessage = (0, common_1.errorCodeToString)(returnCode);
                        var signature = null;
                        if (returnCode === 0x6a80 || returnCode === 0x6984) {
                            errorMessage = response.slice(0, response.length - 2).toString('ascii');
                        }
                        else if (response.length > 2) {
                            signature = response.slice(0, response.length - 2);
                        }
                        return {
                            signature: signature,
                            return_code: returnCode,
                            error_message: errorMessage,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.sign = function (account, change, addressIndex, message, scheme) {
        if (scheme === void 0) { scheme = common_1.SCHEME.ED25519; }
        return __awaiter(this, void 0, void 0, function () {
            var chunks;
            var _this = this;
            return __generator(this, function (_a) {
                chunks = SubstrateApp.signGetChunks(this.slip0044, account, change, addressIndex, message);
                return [2 /*return*/, this.signSendChunk(1, chunks.length, chunks[0], scheme).then(function () { return __awaiter(_this, void 0, void 0, function () {
                        var result, i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    i = 1;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < chunks.length)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.signSendChunk(1 + i, chunks.length, chunks[i], scheme)];
                                case 2:
                                    result = _a.sent();
                                    if (result.return_code !== common_1.ERROR_CODE.NoError) {
                                        return [3 /*break*/, 4];
                                    }
                                    _a.label = 3;
                                case 3:
                                    i += 1;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, {
                                        return_code: result.return_code,
                                        error_message: result.error_message,
                                        signature: result.signature,
                                    }];
                            }
                        });
                    }); }, common_1.processErrorResponse)];
            });
        });
    };
    /// Allow list related commands. They are NOT available on all apps
    SubstrateApp.prototype.getAllowlistPubKey = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.ALLOWLIST_GET_PUBKEY, 0, 0).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        console.log(response);
                        var pubkey = response.slice(0, 32);
                        // 32 bytes + 2 error code
                        if (response.length !== 34) {
                            return {
                                return_code: 0x6984,
                                error_message: (0, common_1.errorCodeToString)(0x6984),
                            };
                        }
                        return {
                            return_code: returnCode,
                            error_message: (0, common_1.errorCodeToString)(returnCode),
                            pubkey: pubkey,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.setAllowlistPubKey = function (pk) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.ALLOWLIST_SET_PUBKEY, 0, 0, pk).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        return {
                            return_code: returnCode,
                            error_message: (0, common_1.errorCodeToString)(returnCode),
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.getAllowlistHash = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.ALLOWLIST_GET_HASH, 0, 0).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        console.log(response);
                        var hash = response.slice(0, 32);
                        // 32 bytes + 2 error code
                        if (response.length !== 34) {
                            return {
                                return_code: 0x6984,
                                error_message: (0, common_1.errorCodeToString)(0x6984),
                            };
                        }
                        return {
                            return_code: returnCode,
                            error_message: (0, common_1.errorCodeToString)(returnCode),
                            hash: hash,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.uploadSendChunk = function (chunkIdx, chunkNum, chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var payloadType;
            return __generator(this, function (_a) {
                payloadType = common_1.PAYLOAD_TYPE.ADD;
                if (chunkIdx === 1) {
                    payloadType = common_1.PAYLOAD_TYPE.INIT;
                }
                if (chunkIdx === chunkNum) {
                    payloadType = common_1.PAYLOAD_TYPE.LAST;
                }
                return [2 /*return*/, this.transport.send(this.cla, common_1.INS.ALLOWLIST_UPLOAD, payloadType, 0, chunk, [common_1.ERROR_CODE.NoError]).then(function (response) {
                        var errorCodeData = response.slice(-2);
                        var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                        var errorMessage = (0, common_1.errorCodeToString)(returnCode);
                        return {
                            return_code: returnCode,
                            error_message: errorMessage,
                        };
                    }, common_1.processErrorResponse)];
            });
        });
    };
    SubstrateApp.prototype.uploadAllowlist = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var chunks;
            var _this = this;
            return __generator(this, function (_a) {
                chunks = [];
                chunks.push(Buffer.from([0]));
                chunks.push.apply(chunks, SubstrateApp.GetChunks(message));
                return [2 /*return*/, this.uploadSendChunk(1, chunks.length, chunks[0]).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                        var i;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (result.return_code !== common_1.ERROR_CODE.NoError) {
                                        return [2 /*return*/, {
                                                return_code: result.return_code,
                                                error_message: result.error_message,
                                            }];
                                    }
                                    i = 1;
                                    _a.label = 1;
                                case 1:
                                    if (!(i < chunks.length)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, this.uploadSendChunk(1 + i, chunks.length, chunks[i])];
                                case 2:
                                    // eslint-disable-next-line no-await-in-loop,no-param-reassign
                                    result = _a.sent();
                                    if (result.return_code !== common_1.ERROR_CODE.NoError) {
                                        return [3 /*break*/, 4];
                                    }
                                    _a.label = 3;
                                case 3:
                                    i += 1;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, {
                                        return_code: result.return_code,
                                        error_message: result.error_message,
                                    }];
                            }
                        });
                    }); }, common_1.processErrorResponse)];
            });
        });
    };
    return SubstrateApp;
}());
exports.SubstrateApp = SubstrateApp;
//# sourceMappingURL=substrate_app.js.map