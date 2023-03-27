import { Chain } from './ChainSelector';

export const chains: Chain[] = [
  {
    name: 'Chain 1',
    ss58Format: 42,
    rpcEndpoints: [
      'wss://soupcan1.jelliedowl.com',
      'wss://soupcan2.jelliedowl.com',
    ],
  },
  {
    name: 'Chain 2',
    ss58Format: 28,
    rpcEndpoints: [
      'wss://chain2-node1.example.com',
      'wss://chain2-node2.example.com',
    ],
  },
  // Add more chains if needed
];
