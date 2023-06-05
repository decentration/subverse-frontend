/// <reference types="node" />
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
export declare const CHUNK_SIZE = 250;
export declare const INS: {
    GET_VERSION: number;
    GET_ADDR: number;
    SIGN: number;
    ALLOWLIST_GET_PUBKEY: number;
    ALLOWLIST_SET_PUBKEY: number;
    ALLOWLIST_GET_HASH: number;
    ALLOWLIST_UPLOAD: number;
};
export declare const PAYLOAD_TYPE: {
    INIT: number;
    ADD: number;
    LAST: number;
};
export declare const P1_VALUES: {
    ONLY_RETRIEVE: number;
    SHOW_ADDRESS_IN_DEVICE: number;
};
export declare const SCHEME: {
    ED25519: number;
    SR25519: number;
};
export declare const ERROR_CODE: {
    NoError: number;
};
export declare const ERROR_DESCRIPTION: any;
export interface SubstrateAppParams {
    name: string;
    cla: number;
    slip0044: number;
    ss58_addr_type: number;
}
export interface ResponseBase {
    error_message: string;
    return_code: number;
}
export interface ResponseAddress extends ResponseBase {
    address: string;
    pubKey: string;
}
export interface ResponseVersion extends ResponseBase {
    device_locked: boolean;
    major: number;
    minor: number;
    patch: number;
    test_mode: boolean;
}
export interface ResponseAllowlistPubKey extends ResponseBase {
    pubKey: string;
}
export interface ResponseAllowlistHash extends ResponseBase {
    hash: Buffer;
}
export interface ResponseSign extends ResponseBase {
    signature: Buffer;
}
export declare function errorCodeToString(statusCode: number): any;
export declare function processErrorResponse(response: any): any;
export declare function getVersion(transport: any, cla: number): Promise<any>;
