import { ApiPromise } from '@polkadot/api';
import React from 'react';

interface ApiPromiseContextType {
  api: ApiPromise | null;
  setApi: React.Dispatch<React.SetStateAction<ApiPromise | null>>;
  decimals: number | null;
  setDecimals: (decimals: number | null) => void;

}

export const ApiPromiseContext = React.createContext<ApiPromiseContextType>({
  api: null,
  decimals: null,
  setApi: () => {},
  setDecimals: () => {},
});
