import definitions from '../components/ChainSelector/specs/soupcan';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { RegistryTypes } from '@polkadot/types/types';
import { JsonRpc } from '@polkadot/rpc-core/types';

// Making sure the types are correctly formed
const types: RegistryTypes = definitions.types;
const rpc: Record<string, Record<string, JsonRpc>> = definitions.rpc;

const setupSuperSigApi = async (endpoint: string, forceRecreate = false): Promise<ApiPromise> => {
  // Check if API is already created and forceRecreate is not set
  if (!forceRecreate && _superSigApi) {
    throw new Error('SuperSig API already created!');
  }

  // Create provider for given endpoint
  const superSigProvider = new WsProvider(endpoint);

  // Create API instance with provider and custom types
  const superSigApi = await ApiPromise.create({
    provider: superSigProvider,
    types,
    rpc,
  });

  // Set global variable for future usage
  _superSigApi = superSigApi;

  return superSigApi;
};

export { setupSuperSigApi };
