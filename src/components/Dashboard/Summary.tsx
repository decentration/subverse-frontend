import 'supersig-types';

import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

type SortedAddress = { address: string; isFavorite: boolean };

interface Props {
  sigCnt: SortedAddress[] | undefined;
  totalProposals: number;
  totalBalance: string;
}

function Summary ({ sigCnt, totalBalance, totalProposals }: Props) {
  const { t } = useTranslation();

  return (

    <div style={{ display: 'flex', marginBottom: '30px' }}>
      {
        sigCnt &&
        <CardSummary label={t<string>('Total Supersigs')}>
        <p>{sigCnt.length}</p>
        </CardSummary>      }
      <CardSummary label={t<string>('Live Proposals')}>
        <p>{totalProposals}</p>
      </CardSummary>
      <CardSummary label={t<string>('Total Funds')}>
        <FormatBalance
          className='result'
          value={totalBalance}
        />
      </CardSummary>
    </div>
  );
}

export default React.memo(Summary);
