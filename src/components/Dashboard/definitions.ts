// import OverrideRpcDefinition from '@polkadot/types/interfaces/jsonrpc';

import type { DefinitionRpc, DefinitionRpcSub } from '@polkadot/types/types';
// import type { DefinitionRpc}

export const superSigRpc: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub> > = {
  superSig: {
    getProposalState: {
      description: 'Get the proposal state',
      params: [
        {
          name: 'supersig_id',
          type: 'AccountId',
        },
        {
          name: 'call_id',
          type: 'CallId',
        },
      ],
      type: 'FetchProposalState',
    },
    getUserSupersigs: {
      description: 'Get supersigs associated to the user.',
      params: [
        {
          name: 'user_account',
          type: 'AccountId',
        },
      ],
      type: 'Vec<SupersigId>',
    },
    listMembers: {
      description: 'List members of the supersig',
      params: [
        {
          name: 'supersig_id',
          type: 'AccountId',
        },
      ],
      type: 'Vec<(AccountId, Role)>',
    },
    listProposals: {
      description: 'List proposals associated to a supersig',
      params: [
        {
          name: 'supersig_id',
          type: 'AccountId',
        },
      ],
      type: 'FetchListProposals',
    },
  },
};