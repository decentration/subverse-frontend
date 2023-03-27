import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { chains } from './chains';
import { chains as mockChains } from './chains';
import '../../App.css'

export interface Chain {
  name: string;
  ss58Format: number;
  rpcEndpoints: string[];
}

interface ChainSelectorProps {
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain | null) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain }) => {
  const [selectedRpc, setSelectedRpc] = useState<string>('');
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);


  const handleRpcSelection = async (rpc: string | null = null) => {
    const rpcEndpoint = rpc || selectedRpc;
  
    if (!rpcEndpoint) return;
  
    try {
      // Set custom autoconnect delay to 5 seconds (5000 ms)
      const provider = new WsProvider(rpc, 5000);
      const api = await ApiPromise.create({ provider });
      const chainResult = await api.rpc.system.chain();
      const { ss58Format } = api.consts.system;
  
      // Find the corresponding chain object in the chains array
      const chain = chains.find((chain) => chain.rpcEndpoints.includes(rpc));
  
      if (!chain) {
        console.error('No matching chain found for the selected RPC.');
        return;
      }
  
      // Check if chainResult is defined before calling toString()
      const chainName = chainResult ? chainResult.toString() : 'Unknown';
  
      // Check if ss58Format is defined before calling toString()
      const parsedSs58Format = ss58Format ? parseInt(ss58Format.toString()) : 0;
  
      setSelectedChain({
        ...chain,
        name: chainName,
        ss58Format: parsedSs58Format,
      });
  
      api.disconnect();
    } catch (error) {
      console.error('Error fetching chain data:', error);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  }, []);
  

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
  
  

  return (
    <div ref={menuRef}>
      <button onClick={() => setOpen(!open)} className="network-button block w-full text-left text-black p-8">
         {selectedChain?.name  || 'Select Network'}
      </button>
      {open && (
        <div className="absolute bg-white rounded mt-2 shadow-md text-black">
          {chains.map((chain, index) => (
            <details key={index}>
              <summary className="font-semibold text-black text-sm">{chain.name}</summary>
              <div>
                {chain.rpcEndpoints.map((rpc, rpcIndex) => (
                  <div key={`${chain.name}-${rpc}`} className="flex items-center">
                    <input
                      key={`${chain.name}-${rpc}`}
                      type="radio"
                      className="mr-2"
                      value={rpc}
                      checked={rpc === selectedRpc}
                      onChange={() => setSelectedRpc(rpc)}
                    />

                    <label htmlFor={`chain${chain.ss58Format}`} className="ml-2 text-black">
                      {rpc}
                    </label>
                  </div>
                ))}
                    <button
                      onClick={() => {
                        handleRpcSelection();
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-black"
                    >
                      Select {chain.name}
                    </button>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      );
    };


