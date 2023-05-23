import React, { useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import PaymentAuthorization from './components/PaymentAuthorization';
import Dashboard from './components/Dashboard/Dashboard';
import { ApiPromiseContext } from './contexts/ApiPromiseContext';
import MembershipDetails from './components/MembershipDetails';
import UserDetails from './components/Auth/UserDetails/UserDetails';
import Sidebar from './components/Sidebar';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountProvider } from './AccountContext';
import Header from './components/Header';
import Modal from './components/Modal';
import AuthSwitcher from './components/Auth/AuthSwitcher/AuthSwitcher';

const App = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [account, setAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isMembershipDetailsOpen, setIsMembershipDetailsOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');

  const handleAccountSelected = (selectedAccount: InjectedAccountWithMeta) => {
    setSelectedAccount(selectedAccount);
    setIsUserDetailsOpen(true);
  };

  const handleMembershipDetails = (selectedAccount: InjectedAccountWithMeta) => {
    setSelectedAccount(selectedAccount);
    setIsMembershipDetailsOpen(true);
  };

  const handleCloseMembershipDetailsModal = () => {
    setIsMembershipDetailsOpen(false);
  };

  const handleCloseUserDetailsModal = () => {
    setIsUserDetailsOpen(false);
  };
  return (
    <ApiPromiseContext.Provider value={{ api, setApi }}>
      <AccountProvider>
        <Router>
        <div className="app-container">
          <div className="header-container">
            <Header
              openUserDetails={setIsUserDetailsOpen}
              selectedAccount={selectedAccount}
              setSelectedAccount={setSelectedAccount}
            />
          </div>
          <div className="sidebar-container">
              <Sidebar />
          </div>
          <div className="main-content">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/register" element={<RegistrationForm onAccountSelected={handleAccountSelected} />} />
                <Route path="/authorize-payment" element={<PaymentAuthorization account={account} />} />
              </Routes>
            </div>
          </div>
          <Modal isOpen={isMembershipDetailsOpen} onClose={handleCloseMembershipDetailsModal}>
            <MembershipDetails account={selectedAccount} />
          </Modal>
          <Modal isOpen={isUserDetailsOpen} onClose={handleCloseUserDetailsModal}>
            <AuthSwitcher mode={mode} setMode={setMode} />
            <RegistrationForm onAccountSelected={handleAccountSelected} />
            <UserDetails account={selectedAccount} mode={mode} setMode={setMode} />
          </Modal>
        </Router>
      </AccountProvider>
    </ApiPromiseContext.Provider>
  );
};


export default App;