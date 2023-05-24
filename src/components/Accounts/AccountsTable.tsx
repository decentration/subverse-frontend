import { useContext } from 'react';
import '../../App.css';
import { AccountsContext } from '../../contexts/AccountsContext';
import { ChainContext } from '../../contexts/ChainContext';

interface TableRowProps {
  name: string;
  balance: number;
}

const TableRow: React.FC<TableRowProps> = ({ name, balance }) => (
  <tr className="table-row">
    <td style={{ padding: '10px' }}>{name}</td>
    <td style={{ padding: '10px' }}>{balance}</td>
  </tr>
);

const AccountsTable: React.FC = () => {
    const { accounts } = useContext(AccountsContext);
    const { selectedRpc } = useContext(ChainContext);
    const tableData = [
        { name: 'Alice', balance: 10000 },
        { name: 'Bob', balance: 10000 },
        // Add more table data if needed
  ];

  return (
    <table className="table-main">
      <thead className="table-head">
        <tr>
          <th>Name</th>
          <th>Balance</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <TableRow
            key={index}
            name={row.name}
            balance={row.balance}
          />
        ))}
      </tbody>
    </table>
  );
};

export default AccountsTable;
