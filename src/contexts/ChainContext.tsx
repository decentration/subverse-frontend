import React, { createContext, useState, useEffect } from 'react';
import { Chain } from '../components/ChainSelector/ChainSelector';
import { chains }  from '../components/ChainSelector/chains';


interface ChainContextProps {
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain | null) => void;
  selectedRpc: string;
  setSelectedRpc: (rpc: string) => void;
}

export const ChainContext = createContext<ChainContextProps>({
  selectedChain: null,
  setSelectedChain: () => {},
  selectedRpc: '',
  setSelectedRpc: () => {},
});

export const ChainProvider: React.FC = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<Chain | null>(null);
  const [selectedRpc, setSelectedRpc] = useState<string>('wss://soupcan1.jelliedowl.com');


  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain, selectedRpc, setSelectedRpc }}>
      {children}
    </ChainContext.Provider>
  );
};
