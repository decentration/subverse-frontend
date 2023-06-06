import React, { useContext } from 'react';
import Table from './Table';
import { ChainContext } from '../../contexts/ChainContext';
import './Dashboard.css';
import '../../App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


const Summary: React.FC<{ title: string; value: number }> = ({ title, value }) => (
  <div className="summary-item">
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const DashboardButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="dashboard-button">
    <span className="mr-2">
    <FontAwesomeIcon icon={faPlus} style={{ marginRight: '7px', minWidth: '20px' }} /> 
    </span>
    {label}
  </button>
);

const Dashboard: React.FC = () => {
  const { selectedChain } = useContext(ChainContext); 
  const sigCnt = 10;
  const totalProposals = 5;
  const totalBalance = 1000;

  const Section: React.FC = ({ children }) => (
    <div className="flex">
      <div className="w-1/2">
        <h2 className="text-lg font-bold">Organisations</h2>
      </div>
      <div className="w-1/2 flex justify-end">
        {children}
      </div>
    </div>
  );
  
  
  return (
    <div className="dashboard-container p-4">
      <div className="summary-section">
        <Summary title="Total Supersigs" value={sigCnt} />
        <Summary title="Active Proposals" value={totalProposals} />
        <Summary title="Total Funds" value={totalBalance} />
      </div>
      <div className="dashboard-buttons">
        <DashboardButton icon="fas fa-plus" label="Create Org" />
        <DashboardButton icon="fas fa-plus" label="Add Member" />
        <DashboardButton icon="fas fa-plus" label="Propose" />
      </div>

      <Section>
        
      </Section>
      <Table />
    </div>
  );
};

export default Dashboard;
