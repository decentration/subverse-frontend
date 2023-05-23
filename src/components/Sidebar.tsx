import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileAlt, faCode, faWallet } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';  // Import your css file for styles

const Sidebar = () => {
    const location = useLocation();

    const isActive = (pathname) => {
      return location.pathname === pathname;
    };
  return (
    <div className="sidebar-container">
      <section>
        <Link className={isActive('/dashboard') ? 'active-link sidebar-button' : 'sidebar-button'} to="/dashboard">
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '7px', minWidth: '20px' }} /> Dashboard
        </Link>
      </section>

      <section>
      <div className='area'>Wallet</div>
        <Link className={isActive('/wallet/accounts') ? 'active-link sidebar-button' : 'sidebar-button'} to="/wallet/accounts">
          <FontAwesomeIcon icon={faWallet} style={{ marginRight: '7px', minWidth: '20px' }} /> Accounts
        </Link>
      </section>

      <section>
        <div className='area'>Orgs</div>
        <Link className='sidebar-button' to="/organisations/create">
          <div><FontAwesomeIcon icon={faPlus} style={{ marginRight: '7px', minWidth: '20px' }} /></div> Create
        </Link>
        <Link className='sidebar-button' to="/organisations/create">
          <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: '7px', minWidth: '20px' }} /> Propose
        </Link>
        <Link className={isActive('/organisations/decode') ? 'active-link sidebar-button' : 'sidebar-button'} to="/organisations/decode">
          <FontAwesomeIcon icon={faCode} style={{ marginRight: '7px', minWidth: '20px' }}/> Decode
        </Link>
      </section>

      
    </div>
  );
};

export default Sidebar;
