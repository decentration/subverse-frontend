// Copyright 2017-2023 @polkadot/app-supersig authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { __AugmentedRpc } from 'supersig-types/dist/interfaces/augment-supersig-rpc';
import type { ComponentProps as Props } from './types';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, SummaryBox, Table } from '@polkadot/react-components';
import { useApi, useCall, useFavorites, useToggle } from '@polkadot/react-hooks';
import { encodeAddress } from '@polkadot/util-crypto';

// import CreateModal from '../../../../page-accounts/src/modals/Create';
import { largeNumSum } from './util';
// import { useTranslation } from '../translate';
import Summary from './Summary';
import Address from './Table';
import { useLoadingDelay } from './useLoadingDelay';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
//   const { t } = useTranslation();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const filterOn = '';
  const [totalProposalCnt, setTotalProposalCnt] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState('');
  const isLoading = useLoadingDelay();
  const { api } = useApi();
  // as unknown as { api: CustomApi };
  const [allAddresses, setAllAddresses] = useState<string[]>([]);
  const supersig_nonce = useCall(api.query.supersig?.nonceSupersig);

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [('Supersig Organisations'), 'start', 2],
    [('live proposals'), 'number'],
    [('balance of (members)'), 'number'],
    [undefined, 'media--1500'],
    [('Supersig balance'), 'balances'],
    [undefined, 'media--1400', 2],
    []
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function getSuperSigAddress () {
      const modl = '0x6d6f646c';
      const pallet_id = api.consts.supersig.palletId.toString();
      const addressArray: string[] = [];

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

      setAllAddresses(addressArray);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getSuperSigAddress();
  }, [api, supersig_nonce]);

  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address: any): SortedAddress => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a: any, b: any): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );

    const setbalance = async () => {
      let totalbalances = '';
      let totalproposal = 0;

      await Promise.all(allAddresses.map(async (address) => {
        const balancesAll = await api.derive.balances?.all(address);
        const sigBalance = (balancesAll.freeBalance.add(balancesAll.reservedBalance)).toString();

        if (totalbalances.length > sigBalance.length) {
          totalbalances = largeNumSum(totalbalances, sigBalance);
        } else {
          totalbalances = largeNumSum(sigBalance, totalbalances);
        }

        const proposals = await api.rpc.superSig.listProposals(address);

        totalproposal = totalproposal + proposals.proposals_info.length;
      }));
      setTotalProposalCnt(totalproposal);
      setTotalBalance(totalbalances);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setbalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAddresses, favorites]);

  return (
    <div
      className={className}
      style={{ overflow: 'auto' }}
    >

      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <StyledDiv>
        <SummaryBox className='header-box'>
          <Summary
            sigCnt={sortedAddresses}
            totalBalance={totalBalance}
            totalProposals={totalProposalCnt}
          />
          <Button.Group>
            <a href={'#/organisations/create/0x080000'}>
              <Button
                className='send-button'
                icon='plus'
                key='create'
                label={('create an org')}
                // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
                onClick={() => {}}
              />
            </a>
          </Button.Group>
        </SummaryBox>
      </StyledDiv>
      <Table
        // empty={!isLoading && sortedAddresses && ('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        // withCollapsibleRows
      >
        {!isLoading && sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={address}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

const StyledDiv = styled.div`
  .ui--Dropdown {
    width: 15rem;
  }

  .header-box {
    .dropdown-section {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: 30px;
    }

    .ui--Button-Group {
      margin-left: auto;
    }
  }
`;

export default React.memo(styled(Overview)`
  .summary-box-contacts {
    align-items: center;
  }
`);
