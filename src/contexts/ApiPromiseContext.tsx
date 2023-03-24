import { ApiPromise } from '@polkadot/api';
import React from 'react';

interface ApiPromiseContextType {
  api: ApiPromise | null;
  setApi: React.Dispatch<React.SetStateAction<ApiPromise | null>>;
}

export const ApiPromiseContext = React.createContext<ApiPromiseContextType>({
  api: null,
  setApi: () => {},
});
