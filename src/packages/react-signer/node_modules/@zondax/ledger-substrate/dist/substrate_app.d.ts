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
import Transport from '@ledgerhq/hw-transport';
import { ResponseAddress, ResponseAllowlistHash, ResponseAllowlistPubKey, ResponseSign, ResponseVersion } from './common';
export declare class SubstrateApp {
    transport: Transport;
    cla: number;
    slip0044: number;
    constructor(transport: any, cla: number, slip0044: number);
    static serializePath(slip0044: number, account: number, change: number, addressIndex: number): Buffer;
    static GetChunks(message: Buffer): Buffer[];
    static signGetChunks(slip0044: number, account: number, change: number, addressIndex: number, message: Buffer): Buffer[];
    getVersion(): Promise<ResponseVersion>;
    appInfo(): Promise<any>;
    getAddress(account: number, change: number, addressIndex: number, requireConfirmation?: boolean, scheme?: number): Promise<ResponseAddress>;
    signSendChunk(chunkIdx: number, chunkNum: number, chunk: any, scheme?: number): Promise<any>;
    sign(account: number, change: number, addressIndex: number, message: Buffer, scheme?: number): Promise<ResponseSign>;
    getAllowlistPubKey(): Promise<ResponseAllowlistPubKey>;
    setAllowlistPubKey(pk: Buffer): Promise<any>;
    getAllowlistHash(): Promise<ResponseAllowlistHash>;
    uploadSendChunk(chunkIdx: number, chunkNum: number, chunk: any): Promise<any>;
    uploadAllowlist(message: any): Promise<any>;
}
