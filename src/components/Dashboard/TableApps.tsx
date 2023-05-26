import type { FetchListProposals, MembersList, ProposalState } from 'supersig-types/dist/interfaces/default';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
// import type { ThemeProps } from '@polkadot/react-components/types';
import type { AccountId, Call } from '@polkadot/types/interfaces';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { AddressInfo, AddressSmall, Button, Call as CallDisplay, ChainLock, Expander, Forget, Icon, IconLink, Input, InputAddress, InputBalance, Menu, Popup } from '@polkadot/react-components';
import IdentityIcon from '@polkadot/react-components/IdentityIcon';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, formatNumber, isFunction, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import { largeNumSum } from './util';
import { useTranslation } from './translate';

// import '../../augment-api-rpc';
interface Props {
  address: string;
  className?: string;
  filter: string;
  isFavorite: boolean;
  toggleFavorite: (address: string) => void;
}

const isEditable = true;

function Address ({ address, className = '', filter, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { theme } = useContext(ThemeContext as React.Context<ThemeProps>);
  const api = useApi();
  const info = useDeriveAccountInfo(address);
  const balancesAll = useBalancesAll(address);
  const [tags, setTags] = useState<string[]>([]);
  const [accName, setAccName] = useState('');
  const [memberCnt, setMemberCnt] = useState(0);
  const [proposalCnt, setProposalCnt] = useState(0);
  const [balancesSum, setBalancesSum] = useState('');
  const [current, setCurrent] = useState<KeyringAddress | null>(null);
  const [genesisHash, setGenesisHash] = useState<string | null>(null);
  const [isForgetOpen, setIsForgetOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const [memberAccounts, setMemberAccounts] = useState<Array<object>>([]);
  const members = useCall<MembersList>(api.api.rpc.superSig.listMembers, [address]);
  const proposals = useCall<FetchListProposals>(api.api.rpc.superSig.listProposals, [address]);
  const nonce = u8aToHex(decodeAddress(address)).toString();

  const _setTags = useCallback(
    (tags: string[]): void => setTags(tags.sort()),
    []
  );

  const getInfo = async () => {
    setMemberCnt(((members?.toArray()) || []).length);
    let tempBalance = '';
    const tempMemberAccounts: Array<object> = [];

    await Promise.all((members?.toArray() || []).map(async (item: any) => {
      const balance = await api.api.derive.balances?.all(item[0]);
      const membalance = (balance.freeBalance.add(balance.reservedBalance)).toString();

      if (tempBalance.length > membalance.length) {
        tempBalance = largeNumSum(tempBalance, membalance);
      } else {
        tempBalance = largeNumSum(membalance, tempBalance);
      }

      const info = { balance: membalance, id: item[0].toString() };

      tempMemberAccounts.push(info);
    }));

    setBalancesSum(tempBalance);
    setMemberAccounts(tempMemberAccounts);
  };

  useEffect((): void => {
    const current = keyring.getAddress(address);

    // eslint-disable-next-line no-void
    void getInfo();
    setProposalCnt((proposals?.proposals_info || []).length);

    setCurrent(current || null);
    setGenesisHash((current && current.meta.genesisHash) || null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, members, proposals]);

  useEffect((): void => {
    const { identity, nickname } = info || {};

    if (isFunction(api.api.query.identity?.identityOf)) {
      if (identity?.display) {
        setAccName(identity.display);
      }
    } else if (nickname) {
      setAccName(nickname);
    }
  }, [api, info]);

  useEffect((): void => {
    const account = keyring.getAddress(address);

    _setTags(account?.meta?.tags as string[] || []);
    setAccName(account?.meta?.name || '');
  }, [_setTags, address]);

  useEffect((): void => {
    if (filter.length === 0) {
      setIsVisible(true);
    } else {
      const _filter = filter.toLowerCase();

      setIsVisible(
        tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(_filter);
        }, accName.toLowerCase().includes(_filter))
      );
    }
  }, [accName, filter, tags]);

  const _onGenesisChange = useCallback(
    (genesisHash: string | null): void => {
      setGenesisHash(genesisHash);

      const account = keyring.getAddress(address);

      account && keyring.saveAddress(address, { ...account.meta, genesisHash });

      setGenesisHash(genesisHash);
    },
    [address]
  );

  const _onFavorite = useCallback(
    (): void => toggleFavorite(address),
    [address, toggleFavorite]
  );

  const _toggleForget = useCallback(
    (): void => setIsForgetOpen(!isForgetOpen),
    [isForgetOpen]
  );

  const _toggleTransfer = useCallback(
    (): void => setIsTransferOpen(!isTransferOpen),
    [isTransferOpen]
  );

  const _onForget = useCallback(
    (): void => {
      if (address) {
        const status: Partial<ActionStatus> = {
          account: address,
          action: 'forget'
        };

        try {
          keyring.forgetAddress(address);
          status.status = 'success';
          status.message = t<string>('address forgotten');
        } catch (error) {
          status.status = 'error';
          status.message = (error as Error).message;
        }
      }
    },
    [address, t]
  );

  if (!isVisible) {
    return null;
  }

  const ProposalDetail = (): React.ReactElement => {
    const VoterComponent = ({ voter }: {voter: AccountId}): React.ReactElement<{voter: AccountId}> => {
      const balances = useCall<DeriveBalancesAll>(api.api.derive.balances?.all, [voter]);
      const voterbalance = balances ? (balances?.freeBalance.add(balances?.reservedBalance)).toString() : '0';
      const [voterRole, setVoterRole] = useState<string>('');

      const getRole = async (address: AccountId) => {
        let role = '';

        // eslint-disable-next-line array-callback-return
        await Promise.all((members?.toArray() || []).map((mem: any) => {
          // eslint-disable-next-line no-cond-assign
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
          <InputAddress
            defaultValue={voter}
            isDisabled
            label={t<string>('Voter')}
          />
          <InputBalance
            defaultValue={voterbalance}
            isDisabled
            label={t<string>('Balance')}
          />
          <Input
            defaultValue={voterRole.toString()}
            isDisabled
            label={t<string>('Role')}
            value={voterRole}
          />
        </>
      );
    };

    const renderProposalInfo = useCallback(
      () => proposals && proposals.proposals_info.map((item: ProposalState, index: number): React.ReactNode => {
        let extrinsicCall: Call;

        // eslint-disable-next-line prefer-const
        extrinsicCall = api.api.createType('Call', item.encoded_call.toString());
        const { method, section } = api.api.registry.findMetaCall(extrinsicCall.callIndex);
        let call_id = u8aToHex(item.id.toU8a(), -1, false).toString();
        const call_data = u8aToHex(item.encoded_call.toU8a(), -1, false).toString();

        for (let k = 0; k < (32 - call_id.length); k++) {
          call_id += '0';
        }

        // let chainId = await api.api.query.supersig.calls
        // let approveCall: any = useCall(api.tx.supersig.approveCall);
        // let decodeApprove = u8aToHex(approveCall.toU8a(), -1, false).toString();
        // let approvelink = '#/orgnaisations/create/`' + `${approveCall}` + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;
        // let approvelink = '#/orgnaisations/create/0x08026d6f646c69642f7375736967' + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;
        const detailslink = '#/organisations/decode/0x08016d6f646c69642f7375736967' + '00000000000000000000000000000000000000' + call_data;
        const approvelink = '#/organisations/create/0x2a026d6f646c69642f7375736967' + nonce.slice(26, 28) + '00000000000000000000000000000000000000' + call_id;

        return (
          // eslint-disable-next-line react/jsx-key
          <div style={{ alignItems: 'center', display: 'flex', minHeight: '35px' }}>
            <Expander
              className='w-full'
              key={index}
              summary={`${section}.${method}`}
            >

              <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>
                <Expander
                  summary={t<string>('Voters(' + item.voters.length.toString() + '/' + proposals.no_of_members.toString() + ')')}
                >
                  {
                    item.voters.map((voterId: AccountId, i: number) => {
                      return (
                        <VoterComponent
                          key={i}
                          voter={voterId}
                        />
                      );
                    }
                    )
                  }
                </Expander>
              </div>
              <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>
                <IconLink
                  href={approvelink}
                  icon='file-signature'
                  label={t<string>('Vote')}
                />
              </div>
              <div style={{ alignItems: 'center', border: '1px dashed lightgrey', borderRadius: '3px', display: 'flex', marginLeft: '28px', marginTop: '5px', minHeight: '50px', padding: '1px 20px' }}>

                <Expander summary={t<string>('Proposal Info ')}>

                  <InputAddress
                    defaultValue={item.provider}
                    isDisabled
                    label={t<string>('Proposer')}
                  />
                  <CallDisplay
                    className='Proposal Info'
                    value={extrinsicCall}
                  />
                  <div style={{ margin: '5px' }}>
                    <IconLink
                      href={detailslink}
                      icon='nfc-magnifying-glass'
                      label={t<string>('extrinsic')}
                    />
                  </div>
                  <Input
                    defaultValue={item.id.toString()}
                    isDisabled
                    label={t<string>('CallId')}
                  />
                </Expander>
              </div>
            </Expander>
          </div>
        );
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [proposals]
    );

    return (
      proposalCnt === 0
        ? <>{proposalCnt}</>
        // eslint-disable-next-line react/jsx-max-props-per-line
        : <ExpanderScroll renderChildren={renderProposalInfo} summary={t<string>(proposalCnt.toString())} />
    );
  };

  interface IMemberItem {
    id?: Uint8Array | string;
    balance?: string;
  }

  const BalanceDetail = (): React.ReactElement => {
    const renderMembers = useCallback(
      () => memberAccounts && memberAccounts.map((item: IMemberItem, index: number): React.ReactNode =>
        <div
          key={index}
          style={{ display: '-webkit-box' }}
        >
          <div style={{ margin: '5px' }}>
            <IdentityIcon value={item.id as Uint8Array} />
          </div>
          <div>
            <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '190px' }}>{item.id}</p>
            <FormatBalance
              className='result'
              value={item.balance}
            />
          </div>
        </div>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [memberAccounts]
    );

    return (
      <ExpanderScroll
        renderChildren={renderMembers}
        summary={<>
          <FormatBalance
            className='result'
            value={balancesSum}
          /> ({formatNumber(memberCnt)})
        </>}
      />
    );
  };

  const PopupDropdown = (
    <Menu>
      <Menu.Item
        isDisabled={!isEditable}
        label={t<string>('Forget this address')}
        onClick={_toggleForget}
      />
      {isEditable && !api.isDevelopment && (
        <>
          <Menu.Divider />
          <ChainLock
            className='addresses--network-toggle'
            genesisHash={genesisHash}
            onChange={_onGenesisChange}
          />
        </>
      )}
    </Menu>
  );

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
        <td className='favorite'>
          <Icon
            color={isFavorite ? 'orange' : 'gray'}
            icon='star'
            onClick={_onFavorite}
          />
        </td>
        <td className='address'>
          <AddressSmall value={address} />
          {address && current && (
            <>
              {isForgetOpen && (
                <Forget
                  address={current.address}
                  key='modal-forget-account'
                  mode='address'
                  onClose={_toggleForget}
                  onForget={_onForget}
                />
              )}
              {isTransferOpen && (
                <Transfer
                  key='modal-transfer'
                  onClose={_toggleTransfer}
                  recipientId={address}
                />
              )}
            </>
          )}
        </td>
        <td className='number'>
          <ProposalDetail />
        </td>
        <td className='number'>
          <BalanceDetail />
        </td>
        <td className='number media--1500'>
          {balancesAll?.accountNonce.gt(BN_ZERO) && formatNumber(balancesAll.accountNonce)}
        </td>
        <td className='number'>
          <AddressInfo
            address={address}
            balancesAll={balancesAll}
            withBalance={{
              available: false,
              bonded: false,
              locked: false,
              redeemable: false,
              reserved: false,
              total: true,
              unlocking: false,
              vested: false
            }}
            withExtended={false}
          />
        </td>
        <td className='links media--1400'>
          <LinkExternal
            className='ui--AddressCard-exporer-link'
            data={address}
            type='address'
          />
        </td>
        <td className='fast-actions-addresses'>
          <div className='fast-actions-row'>
            {isFunction(api.api.tx.balances?.transfer) && (
              <a href={`#/organisations/create/0x08016d6f646c69642f7375736967${nonce.slice(26, 28)}00000000000000000000000000000000000000`}>
                <Button
                  className='send-button'
                  icon='paper-plane'
                  key='propose'
                  label={t<string>('propose')}
                  // eslint-disable-next-line react/jsx-no-bind, @typescript-eslint/no-empty-function
                  onClick={() => {}}
                />
              </a>
            )}
            <Popup
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              className={`theme--${theme}`}
              value={PopupDropdown}
            />
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />
          </div>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td />
        <td>
          <div
            className='tags'
            data-testid='tags'
          >
            <Tags
              value={tags}
              withTitle
            />
          </div>
        </td>
        <td className='number media--1500' />
        <td>
          <AddressInfo
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
          />
        </td>
        <td colSpan={2} />
      </tr>
    </>
  );
}

export default React.memo(styled(Address)`
  &.isCollapsed {
    visibility: collapse;
  }

  &.isExpanded {
    visibility: visible;
  }

  .tags {
    width: 100%;
    min-height: 1.5rem;
  }

  && td.button {
    padding-bottom: 0.5rem;
  }

  .fast-actions-addresses {
    padding-left: 0.2rem;
    padding-right: 1rem;
    width: 1%;

    .fast-actions-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      & > * + * {
        margin-left: 0.35rem;
      }

      .send-button {
        min-width: 6.rem;
      }
    }
  }

  && .ui--AddressInfo .ui--FormatBalance {
    .ui--Icon, .icon-void {
      margin-left: 0.7rem;
      margin-right: 0.3rem
    }
  }
`);
