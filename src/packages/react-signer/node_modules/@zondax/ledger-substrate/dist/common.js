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
exports.getVersion = exports.processErrorResponse = exports.errorCodeToString = exports.ERROR_DESCRIPTION = exports.ERROR_CODE = exports.SCHEME = exports.P1_VALUES = exports.PAYLOAD_TYPE = exports.INS = exports.CHUNK_SIZE = void 0;
/** ******************************************************************************
 *  (c) 2019 - 2022 ZondaX AG
 *  (c) 2016-2017 Ledger
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ******************************************************************************* */
exports.CHUNK_SIZE = 250;
exports.INS = {
    GET_VERSION: 0x00,
    GET_ADDR: 0x01,
    SIGN: 0x02,
    // Allow list related commands
    ALLOWLIST_GET_PUBKEY: 0x90,
    ALLOWLIST_SET_PUBKEY: 0x91,
    ALLOWLIST_GET_HASH: 0x92,
    ALLOWLIST_UPLOAD: 0x93,
};
exports.PAYLOAD_TYPE = {
    INIT: 0x00,
    ADD: 0x01,
    LAST: 0x02,
};
exports.P1_VALUES = {
    ONLY_RETRIEVE: 0x00,
    SHOW_ADDRESS_IN_DEVICE: 0x01,
};
exports.SCHEME = {
    ED25519: 0x00,
    SR25519: 0x01,
};
exports.ERROR_CODE = {
    NoError: 0x9000,
};
exports.ERROR_DESCRIPTION = {
    1: 'U2F: Unknown',
    2: 'U2F: Bad request',
    3: 'U2F: Configuration unsupported',
    4: 'U2F: Device Ineligible',
    5: 'U2F: Timeout',
    14: 'Timeout',
    0x9000: 'No errors',
    0x9001: 'Device is busy',
    0x6802: 'Error deriving keys',
    0x6400: 'Execution Error',
    0x6700: 'Wrong Length',
    0x6982: 'Empty Buffer',
    0x6983: 'Output buffer too small',
    0x6984: 'Data is invalid',
    0x6985: 'Conditions not satisfied',
    0x6986: 'Transaction rejected',
    0x6a80: 'Bad key handle',
    0x6b00: 'Invalid P1/P2',
    0x6d00: 'Instruction not supported',
    0x6e00: 'App does not seem to be open',
    0x6f00: 'Unknown error',
    0x6f01: 'Sign/verify error',
};
function errorCodeToString(statusCode) {
    if (statusCode in exports.ERROR_DESCRIPTION)
        return exports.ERROR_DESCRIPTION[statusCode];
    return "Unknown Status Code: ".concat(statusCode);
}
exports.errorCodeToString = errorCodeToString;
function isDict(v) {
    return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date);
}
function processErrorResponse(response) {
    if (response) {
        if (isDict(response)) {
            if (Object.prototype.hasOwnProperty.call(response, 'statusCode')) {
                return {
                    return_code: response.statusCode,
                    error_message: errorCodeToString(response.statusCode),
                };
            }
            if (Object.prototype.hasOwnProperty.call(response, 'return_code') &&
                Object.prototype.hasOwnProperty.call(response, 'error_message')) {
                return response;
            }
        }
        return {
            return_code: 0xffff,
            error_message: response.toString(),
        };
    }
    return {
        return_code: 0xffff,
        error_message: response.toString(),
    };
}
exports.processErrorResponse = processErrorResponse;
function getVersion(transport, cla) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, transport.send(cla, exports.INS.GET_VERSION, 0, 0).then(function (response) {
                    var errorCodeData = response.slice(-2);
                    var returnCode = errorCodeData[0] * 256 + errorCodeData[1];
                    // 12 bytes + 2 error code
                    if (response.length !== 14) {
                        return {
                            return_code: 0x6984,
                            error_message: errorCodeToString(0x6984),
                        };
                    }
                    var major = response[1] * 256 + response[2];
                    var minor = response[3] * 256 + response[4];
                    var patch = response[5] * 256 + response[6];
                    var deviceLocked = response[7] === 1;
                    // eslint-disable-next-line no-bitwise
                    var targetId = (response[8] << 24) + (response[9] << 16) + (response[10] << 8) + (response[11] << 0);
                    return {
                        return_code: returnCode,
                        error_message: errorCodeToString(returnCode),
                        // ///
                        test_mode: response[0] !== 0,
                        major: major,
                        minor: minor,
                        patch: patch,
                        deviceLocked: deviceLocked,
                        target_id: targetId.toString(16),
                    };
                }, processErrorResponse)];
        });
    });
}
exports.getVersion = getVersion;
//# sourceMappingURL=common.js.map