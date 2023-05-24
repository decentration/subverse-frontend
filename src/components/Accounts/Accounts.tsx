import React from 'react';
import AccountsTable from './AccountsTable';

const Accounts: React.FC = () => {
  const accountData = [
    { name: 'Alice', balance: 10000 },
    { name: 'Bob', balance: 10000 },
  ];

  return (
    <div>
      <h2>Accounts</h2>
      <AccountsTable />
    </div>
  );
};

export default Accounts;
