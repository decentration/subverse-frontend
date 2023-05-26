import React, { useContext, useState } from 'react';
import { ChainContext } from '../../contexts/ChainContext';
import AccountsTable from './AccountsTable';

const Accounts: React.FC = () => {
  const { selectedChain } = useContext(ChainContext);
  const [showEmptyBalances, setShowEmptyBalances] = useState(false);  

  const handleToggleChange = () => {
    setShowEmptyBalances(!showEmptyBalances);
  };

  return (
    <div>
      <h1>Accounts</h1>
      {selectedChain && (
        <table>
          <thead>
            <tr>
              <th>Chain Name</th>
              <th>Chain Decimals</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{selectedChain.name}</td>
              <td>{selectedChain.decimals}</td>
            </tr>
          </tbody>
        </table>
      )}

      <div>
        <input 
          type="checkbox" 
          checked={showEmptyBalances} 
          onChange={handleToggleChange}
        />
        <label>show empty balances</label>
      </div>

      <AccountsTable showEmptyBalances={showEmptyBalances} />
    </div>
  );
};

export default Accounts;
