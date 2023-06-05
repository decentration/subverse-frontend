import { useContext, useState, useEffect } from 'react';
import { AccountsContext } from '../../contexts/AccountsContext';
import { ChainContext } from '../../contexts/ChainContext';
import { ApiPromiseContext } from '../../contexts/ApiPromiseContext';
import { BN } from '@polkadot/util';
import { chains } from '../ChainSelector/chains';
import './Accounts.css';


interface AccountsTableProps {
  showEmptyBalances: boolean;
}
interface TableRowProps {
    name: string;
    balance: string;
    address: string;
}

// In your TableRow component, replace the Tailwind classes with your new CSS classes
const TableRow: React.FC<TableRowProps> = ({ name, address, balance }) => {
  const balanceParts = balance.split('.');
  const integral = balanceParts[0];
  const decimal = balanceParts.length > 1 ? balanceParts[1] : '';
  const zeroBalance = balance.startsWith("0.0000");
  return (
    <tr>
      <td className="account-cell">
        {name}
        <div className="account-address">{address}</div>
      </td>
      <td className={`account-balance ${zeroBalance ? "account-balance-zero" : "account-balance-normal"}`}>
        {integral}.<span className="account-balance-decimal">{decimal}</span>
      </td>
    </tr>
  );
};




const AccountsTable: React.FC<AccountsTableProps> = ({ showEmptyBalances }) => {
  const { api } = useContext(ApiPromiseContext);
    const { accounts } = useContext(AccountsContext);
    const { selectedChain } = useContext(ChainContext);
    const decimals = selectedChain?.decimals ?? 0; 
    const [balances, setBalances] = useState<Map<string, string>>(new Map());

  

    const fetchBalances = async () => {
      console.log("Selected chain: ", selectedChain); 

      const chainDecimals = chains.find(chain => chain.name === selectedChain?.name)?.decimals || 12;
      console.log("Fetched decimals: ", chainDecimals); 

      
      if (!api) return;
      
      try {
        const balancePromises = accounts.map(async (account) => {
          // Log the account address
          console.log('Fetching balance for account:', account.address);
        
          const accountInfo = await api.query.system.account(account.address);
          const balance = accountInfo.data.free;
        
          // Log the balance fetched
          console.log('Balance fetched:', balance.toString());
        
          // Convert balance to base 10 string and add decimal point
          let balanceStr = balance.toString(10);  // updated line
          balanceStr = insertDecimal(balanceStr, chainDecimals);  // updated line
        
          return {
            address: account.address,
            balance: balanceStr,
          };
        });
      
        const balanceArray = await Promise.all(balancePromises);
        const balanceMap = new Map(balanceArray.map(i => [i.address, i.balance]));
    
        setBalances(balanceMap);
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };
    
    

    function insertDecimal(numString: string, decimals: number) {
      // Pad with leading zeros if necessary
      while (numString.length <= decimals) {
        numString = '0' + numString;
      }
    
      // Calculate where to place the decimal
      const decimalPlace = numString.length - decimals;
    
      // Insert the decimal point
      const beforeDecimal = numString.slice(0, decimalPlace) || '0'; // Add a zero if there's nothing before the decimal
      const afterDecimal = numString.slice(decimalPlace);
    
      // Return the number string with inserted decimal
      return beforeDecimal + '.' + afterDecimal;
    }
    
    
    

    useEffect(() => {
      console.log("Balances state:", [...balances.entries()]);  // Debug line 3
    }, [balances]);
    
    
    useEffect(() => {
      fetchBalances();
    }, [selectedChain, api]);


    const balanceDecimalPartStyle = { color: "grey" };
    const zeroBalanceStyle = { color: "grey" };
    const addressStyle = { fontSize: "small", color: "grey" };
    
    return (
      <div>
      <table className="table-main">
          <thead className="table-head">
              <tr>
                  <th>Name</th>
                  <th>Balance</th>
              </tr>
          </thead>
          <tbody>
        {accounts.filter(account => {
          const balance = balances.get(account.address);
          if (!showEmptyBalances && balance === '0.000000000000') {
            return false;
          }
          return true;
        }).map((account, index) => {
          return (
            <TableRow
              key={index}
              name={account.meta.name}
              address={account.address}
              balance={balances.get(account.address) || 'Loading...'}
            />
          )
        })}
      </tbody>
      </table>
      </div>
  );
};
export default AccountsTable;
