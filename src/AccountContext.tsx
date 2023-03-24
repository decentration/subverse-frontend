import React, { createContext, useContext, useState } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface AccountContextData {
  account: InjectedAccountWithMeta | null;
  setAccount: React.Dispatch<React.SetStateAction<InjectedAccountWithMeta | null>>;
}

interface AccountProviderProps {
    children: React.ReactNode;
  }
  

const AccountContext = createContext<AccountContextData | undefined>(undefined);

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
    const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
    return (
      <AccountContext.Provider value={{ account, setAccount }}>
        {children}
      </AccountContext.Provider>
    );
  };
