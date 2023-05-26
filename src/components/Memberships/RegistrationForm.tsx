import React, { useState, useEffect, useContext } from 'react';
import { web3Accounts, web3Enable, web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { useNavigate } from 'react-router-dom';
import { AccountsContext } from '../../contexts/AccountsContext';
import { u8aToHex, stringToU8a } from "@polkadot/util";
import { useSignMessage } from '../../hooks/useSignMessage';



interface MembershipDetailsProps {
    account: InjectedAccountWithMeta | null;
}
interface RegistrationFormProps {
    onAccountSelected: (selectedAccount: InjectedAccountWithMeta) => void;
  }
  
const RegistrationForm: React.FC<RegistrationFormProps> = ({ onAccountSelected }) => {
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const { signature, error, signMessage, messageToSign } = useSignMessage();
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();
  const { accounts } = useContext(AccountsContext);

  
  const registerUser = async (signature: string, message: string, address: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ signature, message, address }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Display the success message
        setInfoMessage('Success');
      } else {
        // Display the error message
        setInfoMessage(data.error || 'Error registering user');
      }
    } catch (error) {
      // Display the error message
      setInfoMessage('Error registering user');
    }
  };

  const onSignClick = async () => {
    if (!selectedAccount) {
      setInfoMessage('Please select an account');
      return;
    }
  
    await signMessage(selectedAccount);
  
    if (signature) {
      // Show the "Signed and pending registration..." message
      setInfoMessage('Signed and pending registration...');
  
      // Send the signed message to the middleware for verification and user registration
      registerUser(signature, messageToSign, selectedAccount.address);
    } else {
      setInfoMessage(error || 'Error signing message');
    }
  };
  

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = accounts.find((account) => account.address === event.target.value) || null;
    setSelectedAccount(selected);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedAccount) {
      onAccountSelected(selectedAccount);
    }
  };
  

  return (
    <form  onSubmit={handleSubmit}>
      <select className="account-select" value={selectedAccount?.address || ''} onChange={handleAccountChange}>
            <option value="">Select account</option>
            {accounts.map((account) => (
             <option key={account.address} value={account.address}>
             {account.meta.name} ({account.address.slice(0, 5)}...{account.address.slice(-5)})
                </option>
            ))}
        </select>
      <button type="submit" disabled={infoMessage !== ''}>
  {infoMessage !== '' ? infoMessage : 'Select'}
</button>
    </form>
  );
};

export default RegistrationForm;

