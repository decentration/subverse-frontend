import { ApiPromise } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { stringToHex } from '@polkadot/util';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';


import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export async function addDelayedProxy(api: ApiPromise, accountInjector: InjectedAccountWithMeta, delegate: string, proxyType: string, delay: number) {
    const injector = await web3FromSource(accountInjector.meta.source);
    const signer = injector?.signer;
  
    if (signer) {
      const signedTx = api.tx.proxy.addProxy(delegate, proxyType, delay);
      const unsub = await signedTx.signAndSend(accountInjector.address, { signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Included in block: ${status.asInBlock}`);
          unsub();
        }
      });
    } else {
      throw new Error('Cannot sign the transaction.');
    }
  }
  
  export async function announceProxy(api: ApiPromise, accountInjector: InjectedAccountWithMeta, real: string, callHash: string) {
    const injector = await web3FromSource(accountInjector.meta.source);
    const signer = injector?.signer;
  
    if (signer) {
      const signedTx = api.tx.proxy.announce(real, callHash);
      const unsub = await signedTx.signAndSend(accountInjector.address, { signer }, ({ status }) => {
        if (status.isInBlock) {
          console.log(`Included in block: ${status.asInBlock}`);
          unsub();
        }
      });
    } else {
      throw new Error('Cannot sign the transaction.');
    }
  }
  
