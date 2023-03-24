import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta, } from '@polkadot/extension-inject/types';
import { useAccountContext } from '../../../AccountContext';
import { useProxyCall } from '../../../hooks/useProxyCall';
import Modal from '../../Modal';
import { useSignMessage } from '../../../hooks/useSignMessage';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { stringToU8a, stringToHex } from '@polkadot/util';
// import AuthenticatedData from './AuthenticatedData';



interface UserDetailsProps {
    account: InjectedAccountWithMeta | null;
  }
  
  const UserDetails: React.FC<UserDetailsProps> = ({ account }) => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();
    const [errorThisMessage, setErrorMessage] = useState<string | null>(null);
    const { signature, error, signMessage, messageToSign } = useSignMessage();
    const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const [registrationStatus, setRegistrationStatus] = useState('');
    const { addProxyCall, errorMessage, transactionSuccess } = useProxyCall(account, () => {
      navigate('/authorize-payment', { state: { account } });
    });
  
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAgreeTerms(e.target.checked);
    };
  
    const registerUser = async (address: string, name: string, signature: string) => {
        try {
          const response = await fetch('http://localhost:3001/api/register-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address, name, signature }),
          });
      
          const data = await response.json();
          if (response.status === 200) {
            localStorage.setItem('token', data.token);
            // User registration was successful
            console.log(data.message);
            setRegistrationStatus('success');
          } else {
            // Handle error messages
            if (response.status === 409) {
              console.error(data.error);
              setRegistrationStatus('userExists');
            } else {
              console.error(data.error);
              setRegistrationStatus('error');
            }
          }
        } catch (error) {
          console.error('Error:', error);
          setRegistrationStatus('networkError');
        }
      };
      
      
  
    const signAndVerify = async () => {
      if (!account) {
        console.error('No account selected');
        return;
      }
  
      try {
        const injector = await web3FromSource(account.meta.source);
  
        const message = 'Please sign this message to verify your identity.';
        if (injector && 'signer' in injector && injector.signer) {
          const signedMessage = await injector.signer?.signRaw({
            address: account.address,
            data: stringToHex(message),
            type: 'bytes',
          });
  
          const response = await fetch('http://localhost:3001/api/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address: account.address,
              message,
              signature: signedMessage.signature,
            }),
          });
  
          const result = await response.json();
          console.log(result);
          if (result.verified) {
            console.log('User is verified');
            registerUser(account.address, account.meta.name ?? 'Unnamed Account', signedMessage.signature);
          } else {
            console.error('User verification failed');
          }
        } else {
          console.error('No injector found or signer is undefined');
        }
      } catch (error) {
        console.error('Error signing message:', error);
      }
    };
  
    const handleConfirm = () => {
        if (!account) {
          setErrorMessage('Please connect an account');
          return;
        }
      
        if (!agreeTerms) {
          setErrorMessage('You must agree to the terms and conditions');
          return;
        }
        // Call the signMessage function from useSignMessage
        signMessage(account)
          .then((signed) => {
            // Check if the signature is available
            if (signed && signed.signature) {
              // Call the registerUser function with the signature, user's name, and account.address
              return registerUser(account.address, account.meta.name ?? 'Unnamed Account', signed.signature);
            } else {
              setErrorMessage('Error signing message');
            }
          })
          .catch((error: any) => {
            // Your error handling code
          });
      };
      
    

      return (
        <div>
          <h2>User Details</h2>
      
          {account ? (
            <>
              <p>Address: {account.address}</p>
              <p>Name: {account.meta.name}</p>
            </>
          ) : (
            <p>Loading account data...</p>
          )}
      
          <label>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={handleCheckboxChange}
            />
            I agree to the terms and conditions
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {transactionStatus === 'pending' && <p>Please wait...</p>}
          {transactionSuccess && transactionStatus === 'success' && <p>Success</p>}
      
          <button onClick={signAndVerify}>Confirm</button>
      
          {registrationStatus === 'success' && (
            <p>User registered successfully</p>
          )}
          {registrationStatus === 'userExists' && (
            <p>User already exists</p>
          )}
          {registrationStatus === 'error' && (
            <p>Error during user registration</p>
          )}
          {registrationStatus === 'networkError' && (
            <p>Network error. Please try again later.</p>
          )}
          {/* <AuthenticatedData /> */}
        </div>
      );
      
};


export default UserDetails;

