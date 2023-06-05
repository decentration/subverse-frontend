import { useContext, useEffect, useState, useCallback } from 'react';
import './Dashboard.css'
import type { AccountId, Call } from '@polkadot/types/interfaces';
import { AddressInfo, InputAddress, InputBalance, IconLink, Call as CallDisplay, Input, Expander  } from '@polkadot/react-components';
import { ChainContext } from '../../contexts/ChainContext';
import { BN_ZERO, formatNumber } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';

interface TableRowProps {
  name: string;
  activeProposals: number;
  members: string;
  supersigBalance: string;
  address: string;
  balancesAll: any
}
export interface TableDataProps {
  address: string;
  balancesAll: any;
}  

interface TableProps {
  data: TableDataProps[];
  api: ApiPromise | null
}

const TableRow: React.FC<TableRowProps> = ({ name, activeProposals, members, supersigBalance,address, balancesAll }) => (
  <tr className="table-row">
    <td style={{ padding: '10px !important' }}>{name}</td>
    <td style={{ padding: '10px !important' }}>
      {activeProposals}
      <i className="fas fa-chevron-down ml-1"></i>
      {/* Nested table */}
      {/* Render nested table when the drop-down arrow is clicked */}
    </td>
    <td style={{ padding: '10px !important' }}>{members}</td>
    <td style={{ padding: '10px !important' }}>
      {"asdf"}
      {/* <AddressInfo
        address={address}
        balancesAll={balancesAll}
        withBalance={{
          available: true,
          bonded: true,
          locked: true,
          redeemable: true,
          reserved: true,
          total: false,
          unlocking: true,
          vested: true
        }}
        withExtended={false}
      /> */}
    </td>
  </tr>
);



  const Table: React.FC<TableProps> = ({data}: TableProps) => {
    const [tableData, setTableData] = useState<TableRowProps[]>([])
    const { selectedChain } = useContext(ChainContext);
    useEffect(()=> {
      setTableData([]);
      data.map((row, index) => {
        setTableData(tableData => [...tableData, { name: selectedChain?.name + 'Supersig' + (index+1).toString(), activeProposals: 3, members: 'John, Kate, Mike', supersigBalance: '1000', address: row.address, balancesAll: row.balancesAll }])
        return 0;
      })
    },[data, selectedChain])
    
    const ProposalDetail = (api: ApiPromise | null, address: string): React.ReactElement => {
      const members = api?.rpc.superSig.listMembers(address);
      const VoterComponent = ({ voter }: {voter: AccountId}): React.ReactElement<{voter: AccountId}> => {
        const balances = api?.derive.balances.all([voter])
        const voterbalance = balances ? (balances?.freeBalance.add(balances?.reservedBalance)).toString() : '0';
        const [voterRole, setVoterRole] = useState<string>('');
    
        const getRole = async (address: AccountId) => {
          let role = '';
    
          await Promise.all((members?.toArray() || []).map((mem: any) => {
            if (mem[0] = address) {
              role = mem[1].type;
            }
          }));
          setVoterRole(role);
        };
    
        useEffect(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          getRole(voter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        return (
          <>
            {/* <InputAddress
              defaultValue={voter}
              isDisabled
              label={'Voter'}
            />
            <InputBalance
              defaultValue={voterbalance}
              isDisabled
              label={'Balance'}
            />
            <Input
              defaultValue={voterRole.toString()}
              isDisabled
              label={'Role'}
              value={voterRole}
            /> */}
          </>
        );
      };
    
      // const renderProposalInfo = useCallback(
      //   () => proposals && proposals.proposals_info.map((item: ProposalState, index: number): React.ReactNode => {
      //     let extrinsicCall: Call;
    
      //     // eslint-disable-next-line prefer-const
      //     extrinsicCall = api.api.createType('Call', item.encoded_call.toString());
      //     const { method, section } = api.api.registry.findMetaCall(extrinsicCall.callIndex);
      //     let call_id = u8aToHex(item.id.toU8a(), -1, false).toString();
      //     const call_data = u8aToHex(item.encoded_call.toU8a(), -1, false).toString();
    
      //     for (let k = 0; k < (32 - call_id.length); k++) {
      //       call_id += '0';
      //     }
    
      //     // let chainId = await api.api.query.supersig.calls
      //     // let approveCall: any = useCall(api.tx.supersig.approveCall);
      //     // let decodeApprove = u8aToHex(approveCall.toU8a(), -1, false).toString();
      //     // let approvelink = '#/supersig/create/`' + `${approveCall}` + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;
      //     // let approvelink = '#/supersig/create/0x08026d6f646c69642f7375736967' + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;
      //     const detailslink = '#/supersig/decode/0x08016d6f646c69642f7375736967' + '00000000000000000000000000000000000000' + call_data;
      //     const approvelink = '#/supersig/create/0x2a026d6f646c69642f7375736967' + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;
    
      //     return (
      //       // eslint-disable-next-line react/jsx-key
      //       <div style={{ alignItems: 'center', display: 'flex', minHeight: '35px' }}>
      //         <Expander
      //           className='w-full'
      //           key={index}
      //           summary={`${section}.${method}`}
      //         >
    
      //           <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>
      //             <Expander
      //               summary={t<string>('Voters(' + item.voters.length.toString() + '/' + proposals.no_of_members.toString() + ')')}
      //             >
      //               {
      //                 item.voters.map((voterId: AccountId, i: number) => {
      //                   return (
      //                     <VoterComponent
      //                       key={i}
      //                       voter={voterId}
      //                     />
      //                   );
      //                 }
      //                 )
      //               }
      //             </Expander>
      //           </div>
      //           <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>
      //             <IconLink
      //               href={approvelink}
      //               icon='file-signature'
      //               label={t<string>('Vote')}
      //             />
      //           </div>
      //           <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>
    
      //             <Expander summary={t<string>('Proposal Info ')}>
    
      //               <InputAddress
      //                 defaultValue={item.provider}
      //                 isDisabled
      //                 label={t<string>('Proposer')}
      //               />
      //               <CallDisplay
      //                 className='Proposal Info'
      //                 value={extrinsicCall}
      //               />
      //               <div style={{ margin: '5px' }}>
      //                 <IconLink
      //                   href={detailslink}
      //                   icon='nfc-magnifying-glass'
      //                   label={t<string>('extrinsic')}
      //                 />
      //               </div>
      //               <Input
      //                 defaultValue={item.id.toString()}
      //                 isDisabled
      //                 label={t<string>('CallId')}
      //               />
      //             </Expander>
      //           </div>
      //         </Expander>
      //       </div>
      //     );
      //   }),
      //   // eslint-disable-next-line react-hooks/exhaustive-deps
      //   [proposals]
      // );
    
      // return (
      //   proposalCnt === 0
      //     ? <>{proposalCnt}</>
      //     // eslint-disable-next-line react/jsx-max-props-per-line
      //     : <ExpanderScroll renderChildren={renderProposalInfo} summary={t<string>(proposalCnt.toString())} />
      // );
    };
  
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
          {tableData?.map((row, index) => (
            <TableRow
              key={index}
              name={row.name}
              activeProposals={row.activeProposals}
              members={row.members}
              supersigBalance={row.supersigBalance}
              address = {row.address}
              balancesAll={row.balancesAll}
            />
          ))}
        </tbody>
      </table>
    );
  };
  
  export default Table;
  