import React from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Subby test</h1>
      {/* <RegistrationForm /> */}
      {/* <Link to="/membership-details">Membership Details</Link> */}
    </div>
  );
};

export default HomePage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import RegistrationForm from './components/RegistrationForm';
// import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// import MembershipDetails from './components/MembershipDetails';



// const HomePage: React.FC = () => {
// const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
//   const navigate = useNavigate();

//   const handlePaymentClick = (account: InjectedAccountWithMeta) => {
//     navigate('/authorize-payment', { state: { account } });
//   };
//   const onAccountSelected = (account: InjectedAccountWithMeta) => {
//     setSelectedAccount(account);

//   };
 

//   return (
//     <div>
//       <h1>HomePage</h1>
//       <RegistrationForm onAccountSelected={onAccountSelected} />
//       {selectedAccount && <MembershipDetails account={selectedAccount} />}
//       <button onClick={() => navigate('/authorize-payment')}>
//         Authorize Payment
//       </button>
//     </div>
//   );
// };

// export default HomePage;



// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { usePolkadotAccount } from './hooks/usePolkadotAccount';

// const HomePage: React.FC = () => {
//   const navigate = useNavigate();
//   const { account, accountInjector } = usePolkadotAccount();

//   const handlePaymentAuthorization = () => {
//     navigate('/authorize-payment', { state: { account, accountInjector } });
//   };

//   return (
//     <div>
//       <h1>Welcome to the Subscription Service</h1>
//       <button onClick={handlePaymentAuthorization}>Authorize Payment</button>
//     </div>
//   );
// };

// export default HomePage;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//     const navigate = useNavigate();

//     const handleClick = () => {
//       navigate('/payment-authorization');
//     };
    
//     const handleSignUpClick = () => {
//       navigate('/register');
//     };

//   return (
//     <div>
//       <h1>Home Page</h1>  
//       <button onClick={handleClick}>Pay</button>
//       <button onClick={handleSignUpClick}>Sign Up</button>
//     </div>
//   );
// };

// export default HomePage;


