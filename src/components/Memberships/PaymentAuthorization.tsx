import React, { useEffect, useContext } from 'react';
import { ApiPromiseContext } from '../../contexts/ApiPromiseContext';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { addDelayedProxy, announceProxy } from '../../utils/polkadot';
import { useParams } from 'react-router-dom';

interface PaymentAuthorizationProps {
  account: InjectedAccountWithMeta | null;
}

const PaymentAuthorization: React.FC<PaymentAuthorizationProps> = () => {
  const { api } = useContext(ApiPromiseContext);
  const { account } = useParams() as any;

  useEffect(() => {
    if (account && api) {
      (async () => {
        const delegate = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Replace with your delegate address
        const proxyType = 'Any';
        const delay = 2000;

        await addDelayedProxy(api, account, delegate, proxyType, delay);
        const callHash = '0xEXAMPLECALLHASH...'; // Replace with your call hash
        await announceProxy(api, account, delegate, callHash);
      })();
    }
  }, [account, api]);

  return (
    <div>
      <h2>Payment Authorization</h2>
    </div>
  );
};

export default PaymentAuthorization;


// import React, { useEffect, useContext } from 'react';
// import { ApiPromiseContext } from '../contexts/ApiPromiseContext';
// import { InjectedAccountWithMeta, InjectedExtension } from '@polkadot/extension-inject/types';
// import { web3FromSource } from '@polkadot/extension-dapp';
// import { addDelayedProxy, announceProxy } from '../utils/polkadot';
// import { useLocation } from 'react-router-dom';


// interface PaymentAuthorizationProps {
//     account: InjectedAccountWithMeta | null;
//     accountInjector: InjectedExtension | null;
//   }

//   const PaymentAuthorization: React.FC<PaymentAuthorizationProps> = () => {
//     const { api } = useContext(ApiPromiseContext);
//     const location = useLocation<{ account: InjectedAccountWithMeta | null; accountInjector: InjectedExtension | null }>();
//     const account = location.state?.account;
//     const accountInjector = location.state?.accountInjector;
  
// //   const PaymentAuthorization: React.FC<PaymentAuthorizationProps> = ({
// //     account, accountInjector,
// //   }) => {
// //   const { api } = useContext(ApiPromiseContext);

//   useEffect(() => {
//     if (account && api) {
//       (async () => {
//         const accountInjector = await web3FromSource(account.meta.source);
//         const delegate = '5EXAMPLEDELEGATEADDRESS...'; // Replace with your delegate address
//         const proxyType = 'Any';
//         const delay = 2000;

//         await addDelayedProxy(api, accountInjector, delegate, proxyType, delay);
//         const callHash = '0xEXAMPLECALLHASH...'; // Replace with your call hash
//         await announceProxy(api, accountInjector, delegate, callHash);
//       })();
//     }
//   }, [account, api]);

//   return (
//     <div>
//       <h2>Payment Authorization</h2>
//     </div>
//   );
// };

// export default PaymentAuthorization;
