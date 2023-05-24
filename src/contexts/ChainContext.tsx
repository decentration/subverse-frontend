import React, { createContext, useState } from 'react';
import { Chain } from '../components/ChainSelector/ChainSelector';

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
  const [selectedRpc, setSelectedRpc] = useState<string>('wss://soupcan1.jelliedowl.com'); // <-- Set default here

  return (
    <ChainContext.Provider value={{ selectedChain, setSelectedChain, selectedRpc, setSelectedRpc }}>
      {children}
    </ChainContext.Provider>
  );
};
