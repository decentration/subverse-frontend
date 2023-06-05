"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newBifrostKusamaApp = exports.newUniqueApp = exports.newInterlayApp = exports.newAlephZeroApp = exports.newStafiApp = exports.newComposableApp = exports.newAstarApp = exports.newParallelApp = exports.newXXNetworkApp = exports.newAcalaApp = exports.newReefApp = exports.newKaruraApp = exports.newBifrostApp = exports.newPolkadexApp = exports.newSoraApp = exports.newNodleApp = exports.newStatemineApp = exports.newStatemintApp = exports.newGenshiroApp = exports.newEquilibriumApp = exports.newEdgewareApp = exports.newCentrifugeApp = exports.newDockApp = exports.newPolymeshApp = exports.newPolkadotApp = exports.newKusamaApp = void 0;
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
var supported_apps_1 = require("./supported_apps");
// Legacy code
function newKusamaApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Kusama');
}
exports.newKusamaApp = newKusamaApp;
function newPolkadotApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Polkadot');
}
exports.newPolkadotApp = newPolkadotApp;
function newPolymeshApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Polymesh');
}
exports.newPolymeshApp = newPolymeshApp;
function newDockApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Dock');
}
exports.newDockApp = newDockApp;
function newCentrifugeApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Centrifuge');
}
exports.newCentrifugeApp = newCentrifugeApp;
function newEdgewareApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Edgeware');
}
exports.newEdgewareApp = newEdgewareApp;
function newEquilibriumApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Equilibrium');
}
exports.newEquilibriumApp = newEquilibriumApp;
function newGenshiroApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Genshiro');
}
exports.newGenshiroApp = newGenshiroApp;
function newStatemintApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Statemint');
}
exports.newStatemintApp = newStatemintApp;
function newStatemineApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Statemine');
}
exports.newStatemineApp = newStatemineApp;
function newNodleApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Nodle');
}
exports.newNodleApp = newNodleApp;
function newSoraApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Sora');
}
exports.newSoraApp = newSoraApp;
function newPolkadexApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Polkadex');
}
exports.newPolkadexApp = newPolkadexApp;
function newBifrostApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Bifrost');
}
exports.newBifrostApp = newBifrostApp;
function newKaruraApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Karura');
}
exports.newKaruraApp = newKaruraApp;
function newReefApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Reef');
}
exports.newReefApp = newReefApp;
function newAcalaApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Acala');
}
exports.newAcalaApp = newAcalaApp;
function newXXNetworkApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'XXNetwork');
}
exports.newXXNetworkApp = newXXNetworkApp;
function newParallelApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Parallel');
}
exports.newParallelApp = newParallelApp;
function newAstarApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Astar');
}
exports.newAstarApp = newAstarApp;
function newComposableApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Composable');
}
exports.newComposableApp = newComposableApp;
function newStafiApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Stafi');
}
exports.newStafiApp = newStafiApp;
function newAlephZeroApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'AlephZero');
}
exports.newAlephZeroApp = newAlephZeroApp;
function newInterlayApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Interlay');
}
exports.newInterlayApp = newInterlayApp;
function newUniqueApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'Unique');
}
exports.newUniqueApp = newUniqueApp;
function newBifrostKusamaApp(transport) {
    return (0, supported_apps_1.newSubstrateApp)(transport, 'BifrostKusama');
}
exports.newBifrostKusamaApp = newBifrostKusamaApp;
//# sourceMappingURL=legacy_apps.js.map