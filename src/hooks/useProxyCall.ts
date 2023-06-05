import { useCallback, useState, useEffect } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';


export const useProxyCall = (account: InjectedAccountWithMeta | null, onSuccess: () => void) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const clearError = useCallback(() => setErrorMessage(null), []);
  const [recipientAccount, setRecipientAccount] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipientAccount() {
      try {
        const response = await fetch('/api/recipient-account');
        const data = await response.json();
        setRecipientAccount(data.recipientAccount);
      } catch (error) {
        console.error('Error fetching recipient account:', error);
      }
    }

    fetchRecipientAccount();
  }, []);

  const addProxyCall = useCallback(async () => {
    if (!account || !recipientAccount) return;

    try {
      const response = await fetch('http://localhost:3001/api/add-proxy-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountAddress: account.address,
          recipientAccount: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
          proxyType: 'Any',
        }),
      });

      if (response.ok) {
        setTransactionSuccess(true);
        onSuccess();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An error occurred during the transaction.');
    }
  }, [account, recipientAccount, onSuccess]);

  return { addProxyCall, errorMessage, clearError, transactionSuccess };
};


