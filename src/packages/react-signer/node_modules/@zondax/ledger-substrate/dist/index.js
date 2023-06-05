"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supportedApps = exports.newSubstrateApp = exports.SubstrateApp = void 0;
__exportStar(require("./legacy_apps"), exports);
var substrate_app_1 = require("./substrate_app");
Object.defineProperty(exports, "SubstrateApp", { enumerable: true, get: function () { return substrate_app_1.SubstrateApp; } });
var supported_apps_1 = require("./supported_apps");
Object.defineProperty(exports, "newSubstrateApp", { enumerable: true, get: function () { return supported_apps_1.newSubstrateApp; } });
Object.defineProperty(exports, "supportedApps", { enumerable: true, get: function () { return supported_apps_1.supportedApps; } });
//# sourceMappingURL=index.js.map