import React, { useContext, useEffect, useState } from 'react';
import Table from './Table';
import { ChainContext } from '../../contexts/ChainContext';
import './Dashboard.css';
import '../../App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ApiPromise } from '@polkadot/api';
import { encodeAddress } from '@polkadot/util-crypto';

import { largeNumSum } from './util';
import { TableDataProps } from './Table';
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
interface DashboardInterface {
  api: ApiPromise | null;
}
const Dashboard: React.FC<DashboardInterface> = ({api}: DashboardInterface) => {
  const { selectedChain } = useContext(ChainContext); 
  const [allAddress, setAllAddress] = useState<string[]>([]);
  const [totalProposalCnt, setTotalProposalCnt] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState('');
  const [tableData, setTableData] = useState<TableDataProps[]>([]);
  const handleChainChange = async (api: ApiPromise | null, selectedChain: any) => {
    if(!api){
      return;
    }
    const modl = '0x6d6f646c';
    const pallet_id = api.consts.supersig.palletId.toString();
    const addressArray: string[] = [];
    const supersig_nonce = await api.query.supersig.nonceSupersig.size();
    const twoDigit = (number: number): string => {
      const twodigit = number >= 10 ? number : '0' + number.toString();
      return twodigit.toString();
    };
    function * asyncGenerator () {
      let i = 0;

      while (i < Number(supersig_nonce)) {
        yield i++;
      }
    }
    
    for await (const num of asyncGenerator()) {
      const supersig_concat = (modl + pallet_id.slice(2, pallet_id.length) + twoDigit(num) + '00000000000000000000000000000000000000');
      const account = encodeAddress(supersig_concat);
      try {
        const members: any[] = (await api.rpc.superSig.listMembers(account)).toArray();
        if (members.length > 0) {
          addressArray.push(account.toString());
        }
      } catch (err) {}
    }
    setAllAddress(addressArray);
  }
  useEffect( () => {
    handleChainChange(api, selectedChain)
  }, [api, selectedChain])
  
  useEffect(() => {
    const setbalance = async (api: ApiPromise | null) => {
      let totalbalances = '';
      let totalproposal = 0;
      if(!api){
        return;
      }
      await Promise.all(allAddress.map(async (address) => {
        const balancesAll = await api.derive.balances?.all(address);
        const sigBalance = (balancesAll.freeBalance.add(balancesAll.reservedBalance)).toString();

        if (totalbalances.length > sigBalance.length) {
          totalbalances = largeNumSum(totalbalances, sigBalance);
        } else {
          totalbalances = largeNumSum(sigBalance, totalbalances);
        }
        console.log("proposals")
        const proposals = await api.rpc.superSig.listProposals(address);
        
        // console.log(proposals)
        totalproposal = totalproposal + proposals.proposals_info.length;
      }));
      setTotalProposalCnt(totalproposal);
      setTotalBalance(totalbalances);
    };
    
    const getTableData = async (api: ApiPromise | null) => {
      allAddress.map(async (address) => {
        if(!api){
          return;
        }
        const balancesAll = await api.derive.balances?.all(address);
        setTableData(tableData => [...tableData, {address: address, balancesAll: balancesAll}]);
      })
    }
    setbalance(api);
    getTableData(api);
  }, [allAddress, api])

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
        <Summary title="Total Supersigs" value={allAddress.length} />
        <Summary title="Active Proposals" value={totalProposalCnt} />
        <Summary title="Total Funds" value={Number(totalBalance)} />
      </div>
      <div className="dashboard-buttons">
        <DashboardButton icon="fas fa-plus" label="Create Org" />
        <DashboardButton icon="fas fa-plus" label="Add Member" />
        <DashboardButton icon="fas fa-plus" label="Propose" />
      </div>
      <Section>
        
      </Section>
      <Table data = {tableData} api = {api}/>
    </div>
  );
};

export default Dashboard;
