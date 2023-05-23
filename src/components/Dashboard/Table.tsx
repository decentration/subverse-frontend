import './Dashboard.css'


interface TableRowProps {
    name: string;
    activeProposals: number;
    members: string;
    supersigBalance: string;
  }
  
  const TableRow: React.FC<TableRowProps> = ({ name, activeProposals, members, supersigBalance }) => (
    <tr className="table-row">
      <td style={{ padding: '10px !important' }}>{name}</td>
      <td style={{ padding: '10px !important' }}>
        {activeProposals}
        <i className="fas fa-chevron-down ml-1"></i>
        {/* Nested table */}
        {/* Render nested table when the drop-down arrow is clicked */}
      </td>
      <td style={{ padding: '10px !important' }}>{members}</td>
      <td style={{ padding: '10px !important' }}>{supersigBalance}</td>
    </tr>
  );
  
  const Table: React.FC = () => {
    const tableData = [
      { name: 'Org 1', activeProposals: 3, members: 'John, Kate, Mike', supersigBalance: '1000' },
      { name: 'Org 2', activeProposals: 5, members: 'Alice, Bob', supersigBalance: '2000' },
      // Add more table data if needed
    ];


  
    return (
      <table className="table-main">
        <thead className="table-head">
          <tr >
            <th>Name</th>
            <th>Active Proposals</th>
            <th>Members (Balance)</th>
            <th>Supersig Balance</th>
          </tr>
        </thead>
        <tbody>
          {/* Render table rows */}
          {tableData.map((row, index) => (
            <TableRow
              key={index}
              name={row.name}
              activeProposals={row.activeProposals}
              members={row.members}
              supersigBalance={row.supersigBalance}
            />
          ))}
        </tbody>
      </table>
    );
  };
  
  export default Table;
  