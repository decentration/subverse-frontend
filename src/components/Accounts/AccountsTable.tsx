import { useContext, useState, useEffect } from 'react';
import { AccountsContext } from '../../contexts/AccountsContext';
import { ChainContext } from '../../contexts/ChainContext';
import { ApiPromiseContext } from '../../contexts/ApiPromiseContext';
import { BN } from '@polkadot/util';


interface TableRowProps {
    name: string;
    balance: any;
  }
  

  const TableRow: React.FC<TableRowProps> = ({ name, balance }) => (
    <tr className="table-row">
      <td style={{ padding: '10px' }}>{name}</td>
      <td style={{ padding: '10px' }}>{balance}</td>
    </tr>
  );

const AccountsTable: React.FC = () => {
    const { api } = useContext(ApiPromiseContext);
    const { accounts } = useContext(AccountsContext);
    const { selectedChain } = useContext(ChainContext);
    const decimals = selectedChain?.decimals ?? 0;  // updated line
    const [balances, setBalances] = useState<Map<string, number>>(new Map());

  

    const fetchBalances = async () => {
      // Use decimals from selectedChain or default to 0 if selectedChain is null
      const chainDecimals = selectedChain?.decimals ?? 0;

      
      
      if (!api) return;
      
  
    
      try {
        const balancePromises = accounts.map(async (account) => {
          // Log the account address
          console.log('Fetching balance for account:', account.address);
    
          const accountInfo = await api.query.system.account(account.address);
          const balance = accountInfo.data.free;

          console.log("Fetched balance for account", account.address, balance.toString()); 
    
          const balanceBN = new BN(balance);
          const ten = new BN(10);
          const divisor = ten.pow(new BN(chainDecimals));
          const displayBalance = balanceBN.div(divisor);
          return {
            address: account.address,
            balance: displayBalance.toString(),
          };
        });
      
        const balanceArray = await Promise.all(balancePromises);
        const balanceMap = new Map(balanceArray.map(i => [i.address, parseFloat(i.balance)]));
        
        console.log("Balance map:", [...balanceMap.entries()]); 
    
        setBalances(balanceMap);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    useEffect(() => {
      console.log("Balances state:", [...balances.entries()]);  // Debug line 3
    }, [balances]);
    
    
    useEffect(() => {
      fetchBalances();
    }, [selectedChain, api]);
    
    return (
      <table className="table-main">
        <thead className="table-head">
          <tr>
              <th>Name</th>
              <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => {
            // Log the balance that is being rendered
            console.log('Rendering balance for account:', balances.get(account.address));
            return (
              <TableRow
                key={index}
                name={account.meta.name}
                balance={balances.get(account.address)?.toString() || 'Loading...'}
              />
            )
          })}
        </tbody>
      </table>
    );
    
};

export default AccountsTable;
