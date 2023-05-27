// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line header/header
import type { OverrideBundleDefinition } from '@polkadot/types/types';

const definitions: OverrideBundleDefinition = {
  rpc: {
    superSig: {
      getProposalState: {
        description: 'Get the proposal state',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          },
          {
            name: 'call_id',
            type: 'CallId'
          }
        ],
        type: 'FetchProposalState'
      },
      getUserSupersigs: {
        description: 'Get supersigs associated to the user.',
        params: [
          {
            name: 'user_account',
            type: 'AccountId'
          }
        ],
        type: 'Vec<SupersigId>'
      },
      listMembers: {
        description: 'List members of the supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'Vec<(AccountId, Role)>'
      },
      listProposals: {
        description: 'List proposals associated to a supersig',
        params: [
          {
            name: 'supersig_id',
            type: 'AccountId'
          }
        ],
        type: 'FetchListProposals'
      }
    }
  },
  types: [
    {
      minmax: [
        0,
        null
      ],
      types: {
        CallId: 'u32',
        FetchListProposals: {
          no_of_members: 'u32',
          proposals_info: 'ProposalStates'
        },
        FetchProposalState: {
          no_of_members: 'u32',
          proposal_info: 'ProposalState<AccountId>'
        },
        ProposalState: {
          encoded_call: 'Vec<u8>',
          id: 'CallId',
          provider: 'AccountId',
          voters: 'Vec<AccountId>'
        },
        ProposalStates: 'Vec<ProposalState<AccountId>>',
        Role: {
          _enum: {
            Master: 'Vec<u8>',
            NotMember: 'Vec<u8>',
            Standard: 'Vec<u8>'
          }
        },
        SupersigId: 'u132'
      }
    }
  ]
};

export default definitions;
