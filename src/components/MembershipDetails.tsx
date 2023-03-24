import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../AccountContext';
import { useProxyCall } from '../hooks/useProxyCall';
import Modal from './Modal';



interface MembershipDetailsProps {
    account: InjectedAccountWithMeta | null;
}
  
const MembershipDetails: React.FC<MembershipDetailsProps> = ({ account }) => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();
    const [errorThisMessage, setErrorMessage] = useState<string | null>(null); 
    const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const { addProxyCall, errorMessage, transactionSuccess } = useProxyCall(account, () => {
        navigate('/authorize-payment', { state: { account } });
        });  
    console.log('Account in MembershipDetails:', account); 

    

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
  };

  const handleConfirm = async () => {
    if (!agreeTerms) {
      alert('Please agree to the terms and conditions to proceed.');
      return;
    }
    setErrorMessage(null);
    setTransactionStatus('pending');
  
    const clearError = () => {
      setErrorMessage(null);
    };
  
    clearError();
    setTransactionStatus('pending');
    try {
      await addProxyCall();
      setTransactionStatus('success');
      if (transactionSuccess) {
        navigate('/authorize-payment', { state: { account } });
      }
    } catch {
      // Error handling is done in the useProxyCall hook, so no need to handle it here.
    }
};
return (
    
    <div>
    <h2>Membership Details</h2>
    
    {account ? (
        <>
        <p>Address: {account.address}</p>
        <p>Name: {account.meta.name}</p>
        </>
    ) : (
        <p>Loading account data...</p>
    )}
    <p>Fee: $25</p>
    <p>Delay: 2000 blocks</p>
    <label>
        <input type="checkbox" checked={agreeTerms} onChange={handleCheckboxChange} />
        I agree to the terms and conditions
    </label>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
    {transactionStatus === 'pending' && <p>Please wait...</p>}
    {transactionSuccess && transactionStatus === 'success' && <p>Success</p>}


    <button onClick={handleConfirm}>Confirm</button>
    
    </div>
  );
};

export default MembershipDetails;


