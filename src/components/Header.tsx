import React from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { useState, useEffect } from 'react';
import { ChainSelector, Chain } from './ChainSelector/ChainSelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet } from '@fortawesome/free-solid-svg-icons'


interface HeaderProps {
    openUserDetails: (isOpen: boolean) => void;
    selectedAccount: InjectedAccountWithMeta | null;
    setSelectedAccount: (account: InjectedAccountWithMeta | null) => void;
    selectedRpc: string;
    setSelectedRpc: (rpc: string) => void;
    
  }

  const Header: React.FC<HeaderProps> = ({ openUserDetails, selectedAccount, setSelectedAccount, selectedRpc, setSelectedRpc }) => {
    const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
    const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
          try {
            await web3Enable('Subverse');
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
        <ChainSelector selectedChain={selectedChain} setSelectedChain={setSelectedChain} selectedRpc={selectedRpc} setSelectedRpc={setSelectedRpc} />
        </div>  
      </div>
    <div className="logo subverse-style">Supersig</div>
      <div className="accounts-area">
      <button className="accounts-button subverse-style" onClick={handleOpenUserDetails}><FontAwesomeIcon icon={faWallet} style={{ marginRight: '10px' }} />  Accounts</button>
      </div>
    </header>
  );
};

export default Header;