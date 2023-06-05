import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

export function usePolkadotAccount() {
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const { api } = useApi();

  useEffect(() => {
    const enableExtension = async () => {
      await web3Enable('Your App Name');
      const accounts = await web3Accounts();
      setAccount(accounts[0]);
    };

    if (api) {
      enableExtension();
    }
  }, [api]);

  return { account };
}