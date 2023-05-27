import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SignerPayloadRaw } from '@polkadot/types/types';
import { stringToU8a, stringToHex } from '@polkadot/util';
import { web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta, } from '@polkadot/extension-inject/types';
// import { useAccountContext } from '../../../contexts/AccountsContext';
import { useProxyCall } from '../../../hooks/useProxyCall';
import { useSignMessage } from '../../../hooks/useSignMessage';
import DetailsInput from '../../DetailsInput';
import AuthSwitcher from '../AuthSwitcher/AuthSwitcher';
import AuthForm from '../AuthForm/AuthForm';
import { encodeAddress } from '@polkadot/util-crypto';


// import AuthenticatedData from './AuthenticatedData';



interface UserDetailsProps {
    account: InjectedAccountWithMeta | null;
    mode: 'login' | 'signup';
    setMode: (mode: 'login' | 'signup') => void;
  }
  
  const UserDetails: React.FC<UserDetailsProps> = ({ account, mode, setMode }) => {
    const [agreeTerms, setAgreeTerms] = useState(false);
    const navigate = useNavigate();
    const [errorThisMessage, setErrorMessage] = useState<string | null>(null);
    const { error, signMessage, messageToSign } = useSignMessage();
    const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const [registrationStatus, setRegistrationStatus] = useState('');
    const [inputDisabled, setInputDisabled] = useState(true);
    const [name, setName] = useState(account?.meta.name ?? null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [signature, setSignature] = useState<string | null>(null);
    


    const { addProxyCall, errorMessage, transactionSuccess } = useProxyCall(account, () => {
      navigate('/authorize-payment', { state: { account } });
    });
  
    const toggleInputDisabled = () => {
      setInputDisabled(!inputDisabled);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAgreeTerms(e.target.checked);
    };

    // Update the state when the name input changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    };

    const handleLogin = async () => {
      
        if (!address || !signature) {
          setLoginError('Please make sure the address and signature are provided.');
          return;
        }
        try {
        const response = await loginUser(address, signature);
    
        if (response.error) {
          setLoginError(response.error);
        } else {
          // Update the user state or perform any other action after a successful login.
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('An error occurred during login');
      }
    };
    
    

    const isLoginMode = mode === 'login';
    const isSignupMode = mode === 'signup';

    useEffect(() => {
      if (account) {
        setName(account.meta.name ?? '');
      }
    }, [account]);
  
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
            setRegistrationStatus('loggedIn');
          } else {
            if (response.status === 404) {
              console.error(data.error);
              setRegistrationStatus('userNotFound');
              return { error: 'User not found' };
            } else {
              console.error(data.error);
              setRegistrationStatus('loginError');
              return { error: data.error };
            }
          }
        } catch (error) {
          console.error('Error:', error);
          setRegistrationStatus('networkError');
          return { error: 'Network error' };
        }
      };
      const loginUser = async (address: string, signature: string): Promise<{ data?: any; error?: string }> => {
        try {
          const response = await fetch('http://localhost:3001/api/login-user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address, signature }),
          });
      
          const data = await response.json();
          if (response.status === 200) {
            localStorage.setItem('token', data.token);
            console.log(data.message);
            setRegistrationStatus('loggedIn');
            return { data };
          } else {
            if (response.status === 404) {
              console.error(data.error);
              setRegistrationStatus('userNotFound');
              return { error: 'User not found' };
            } else {
              console.error(data.error);
              setRegistrationStatus('loginError');
              return { error: 'An error occurred during login' };
            }
          }
        } catch (error) {
          console.error('Error:', error);
          setRegistrationStatus('networkError');
          return { error: 'An error occurred during login' };
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
          const signedMessage: any = await injector.signer?.signRaw({
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
              signature: signedMessage?.signature,
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
      
        if (mode === 'signup' && !agreeTerms) {
          setErrorMessage('You must agree to the terms and conditions');
          return;
        }
        // Call the signMessage function from useSignMessage
        signMessage(account)
          .then((signed) => {
            // Check if the signature is available
            if (signed && signed.signature) {
              // Call the loginUser or registerUser function depending on the mode
              if (mode === 'login') {
                loginUser(account.address, signed.signature);
              } else {
              // Call the registerUser function with the signature, user's name, and account.address
               registerUser(account.address, account.meta.name ?? 'Unnamed Account', signed.signature);
              } 
            } else {
              setErrorMessage('Error signing message');
            }
          })
          .catch((error: any) => {
            // Your error handling code
          });
      };
      
 

      return (
        <>
      
          {account ? (
            <div>
            <h2>User Details</h2>
            <div className="flex flex-col items-start">
              <DetailsInput
                label="Address:"
                value={account.address}
                disabled={true}
              />
              <DetailsInput
                label="Username:"
                value={name}
                disabled={inputDisabled}
                onChange={handleNameChange}
                />
             <button
                className="text-blue-500 underline focus:outline-none"
                onClick={toggleInputDisabled}
             >
              
              {inputDisabled ? 'Change' : 'Save'}
            </button>
          </div>
          <br></br>
             
              {mode === 'signup' && (
                <label>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={handleCheckboxChange}
                  />
                  I agree to the terms and conditions
                </label>
              )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {transactionStatus === 'pending' && <p>Please wait...</p>}
          {transactionSuccess && transactionStatus === 'success' && <p>Success</p>}
          <br></br>
          <AuthForm account={account} mode={mode} onConfirm={handleConfirm} />

          </div>
          ) : ( ''
          )}
      
          { loginError && ( <p className="error-message"> {loginError} </p>)}
      
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
        </>
      );
      
};


export default UserDetails;

