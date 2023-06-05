import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-dapp';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

interface AccountsContextProps {
  accounts: InjectedAccountWithMeta[];
}

// Create the context with default values
export const AccountsContext = createContext<AccountsContextProps>({ accounts: [] });

interface AccountsProviderProps {
  children: ReactNode;  
}

export const AccountsProvider: React.FC<AccountsProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        await web3Enable('App Name');
        const allAccounts = await web3Accounts();
        setAccounts(allAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider value={{ accounts }}>
      {children}  
    </AccountsContext.Provider>
  );
};


// import React, { createContext, useContext, useState } from 'react';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

// interface AccountContextData {
//   account: InjectedAccountWithMeta | null;
//   setAccount: React.Dispatch<React.SetStateAction<InjectedAccountWithMeta | null>>;
// }

// interface AccountProviderProps {
//     children: React.ReactNode;
//   }
  

// const AccountContext = createContext<AccountContextData | undefined>(undefined);

// export const useAccountContext = () => {
//   const context = useContext(AccountContext);
//   if (context === undefined) {
//     throw new Error('useAccountContext must be used within an AccountProvider');
//   }
//   return context;
// };

// export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
//     const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
//     return (
//       <AccountContext.Provider value={{ account, setAccount }}>
//         {children}
//       </AccountContext.Provider>
//     );
//   };
