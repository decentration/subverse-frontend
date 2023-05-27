import { Chain } from './ChainSelector';
import { kabochaDefinitions, soupcanDefinitions, statemineDefinitions } from './specs';

export const chains: Chain[] = [
  {
    name: 'Soupcan',
    ss58Format: 42,
    decimals: 12,
    rpcEndpoints: [
      'wss://soupcan1.jelliedowl.com',
      'wss://soupcan2.jelliedowl.com',
    ],
    definitions: soupcanDefinitions, 

  },
  {
    name: 'Kabocha',
    ss58Format: 27,
    decimals: 12,
    rpcEndpoints: [
      'wss://kabocha1.jelliedowl.com',
      'wss://kabocha.jelliedowl.com',
    ],
    definitions: kabochaDefinitions,
  },
  {
    name: 'Statemine',
    ss58Format: 2,
    decimals: 12,
    rpcEndpoints: [
      'wss://statemine.api.onfinality.io/public-ws',
      'wss://rpc-statemine.luckyfriday.io',
    ],
    definitions: statemineDefinitions,
  },
  // Add more chains if needed
];
