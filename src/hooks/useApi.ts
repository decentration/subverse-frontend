import { useState, useEffect } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

export function useApi() {
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    const createApi = async () => {
      const provider = new WsProvider('wss://rpc.polkadot.io');
      const apiInstance = new ApiPromise({ provider });
      await apiInstance.isReady;
      setApi(apiInstance);
    };

    createApi();
  }, []);

  return { api };
}
