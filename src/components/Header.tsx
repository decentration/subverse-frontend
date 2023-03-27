import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useState, useEffect } from 'react';
import { ChainSelector, Chain } from './ChainSelector/ChainSelector';


interface HeaderProps {
    openUserDetails: (isOpen: boolean) => void;
    selectedAccount: InjectedAccountWithMeta | null;
    setSelectedAccount: (account: InjectedAccountWithMeta | null) => void;
  }

  const Header: React.FC<HeaderProps> = ({ openUserDetails, selectedAccount, setSelectedAccount }) => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
          try {
            await web3Enable('Subby');
            const allAccounts = await web3Accounts();
            setAccounts(allAccounts);
          } catch (error) {
            console.error('Error fetching accounts:', error);
          }
        };
      
        fetchAccounts();
    }, []);

    const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAddress = e.target.value;
        const account = accounts.find((account) => account.address === selectedAddress) || null;
        setSelectedAccount(account);
      };

      const handleOpenUserDetails = () => {
        openUserDetails(true);
      };

    return (
    <header className="header subby-style">
      <div className="relative inline-block text-left">
      <div className="chain-selector-container">
        <ChainSelector selectedChain={selectedChain} setSelectedChain={setSelectedChain} />
      </div>

      </div>
    <div className="logo">Subby</div>
      <div className="signup-area">
      {/* <select className="account-select" value={selectedAccount?.address || ''} onChange={handleAccountChange}>
            <option value="">Select account</option>
            {accounts.map((account) => (
             <option key={account.address} value={account.address}>
             {account.meta.name} ({account.address.slice(0, 5)}...{account.address.slice(-5)})
                </option>
            ))}
        </select> */}
      <button className="register-button subby-style" onClick={handleOpenUserDetails}>Connect</button>
      </div>
    </header>
  );
};

export default Header;