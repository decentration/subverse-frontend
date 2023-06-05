import { ApiPromise } from '@polkadot/api';

export async function testChainConnection(api: ApiPromise | null) {
  console.log('=== Testing Chain Connection ===');

  // Check if we're connected to a chain
  if (api?.isConnected) {
    const chainName = await api.rpc.system.chain();
    console.log('Connected to chain...', chainName.toString());

    // Check if the balances pallet is available
    if (api.query.balances?.account) {
      console.log('Balances pallet is available.');
    } else {
      console.log('Balances pallet is not available.');
    }
  } else {
    console.log('Not connected to a chain.');
  }

  console.log('=== Testing Completed ===');
}



