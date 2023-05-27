import { useContext, useState, useEffect } from 'react';
import { AccountsContext } from '../../contexts/AccountsContext';
import { ChainContext } from '../../contexts/ChainContext';
import { ApiPromiseContext } from '../../contexts/ApiPromiseContext';
import { BN } from '@polkadot/util';
import { chains } from '../ChainSelector/chains';


interface TableRowProps {
    name: string;
    balance: string;
    address: string;
}

const TableRow: React.FC<TableRowProps> = ({ name, address, balance }) => {
  const balanceParts = balance.split('.');
  const integral = balanceParts[0];
  const decimal = balanceParts.length > 1 ? balanceParts[1] : '';
  const zeroBalance = balance.startsWith("0.0000");
  return (
    <tr>
      <td className="p-2 border-b border-gray-200 text-black">
        {name}
        <div className="text-xs text-gray-500">{address}</div>
      </td>
      <td className={`px-6 py-4 whitespace-nowrap text-sm ${zeroBalance ? "text-gray-400" : "text-gray-500"}`}>
        {integral}.<span className="text-gray-400">{decimal}</span>
      </td>
    </tr>
  );
};



const AccountsTable: React.FC = () => {
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
                          address={account.address}
                          balance={balances.get(account.address) || 'Loading...'}
                      />
                  )
              })}
          </tbody>
      </table>
  );
};
export default AccountsTable;
