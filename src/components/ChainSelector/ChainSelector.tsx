import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { chains } from './chains';
import { chains as mockChains } from './chains';
import '../../App.css'
import { OverrideBundleDefinition } from '@polkadot/types/types';
import customTypes from 'supersig-types';

export interface Chain {
  // rpc(rpc: any): unknown;
  name: string;
  ss58Format: number;
  rpcEndpoints: string[];
  definitions: OverrideBundleDefinition;
  decimals: number; 

}

interface ChainSelectorProps {
  selectedChain: Chain | null;
  setSelectedChain: (chain: Chain | null) => void;
  selectedRpc: string;
  setSelectedRpc: (rpc: string) => void;
}

export const ChainSelector: React.FC<ChainSelectorProps> = ({ selectedChain, setSelectedChain, selectedRpc, setSelectedRpc }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [tempRpc, setTempRpc] = useState<string>(selectedRpc);  // New state for temporary RPC URL

   // Whenever selectedChain is updated, update the tempRpc state
   useEffect(() => {
    if (selectedChain) {
      setTempRpc(selectedChain.rpcEndpoints[0]);
    }
  }, [selectedChain]);

//   const handleRpcSelection = () => {
//     console.log("Selected RPC: ", selectedRpc);
// };

  const handleRpcSelection = async (rpc: string | null = null) => {
    console.log("handleRpcSelection called");
    const rpcEndpoint = rpc || tempRpc; // use tempRpc here

    if (!rpcEndpoint) return;

    console.log("RPC Endpoint:", rpcEndpoint); // Add this line to log the rpcEndpoint
  
    try {
      // Set custom autoconnect delay to 5 seconds (5000 ms)
      const provider = new WsProvider(rpc, 5000);
      const api = await ApiPromise.create({ 
        provider, 
      });
      const chainResult = await api.rpc.system.chain();
      const { ss58Format } = api.consts.system;
  
      // Find the corresponding chain object in the chains array
      const chain = chains.find((chain) => chain.rpcEndpoints);
  
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
        definitions: chain.definitions, 
        decimals: chain.decimals,

      });
  
      setSelectedRpc(rpcEndpoint);

      api.disconnect();
    } catch (error) {
      console.error('Error fetching chain data:', error);
    }

    setSelectedRpc(rpcEndpoint);  // This updates the actual RPC URL

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
        <div className="absolute bg-white rounded shadow-md text-black">
          {chains.map((chain, index) => (
            <details key={index}>
              <summary className="font-semibold text-black text-sm">{chain.name}</summary>
              <div>
                {chain.rpcEndpoints.map((rpc, rpcIndex) => (
                  <div key={`${chain.name}-${rpc}`} className="flex items-center">
                    {/* <input
                      key={`${chain.name}-${rpc}`}
                      type="radio"
                      className="mr-2"
                      value={rpc}
                      checked={rpc === selectedRpc}
                      
                      onChange={() => {
                        console.log("Selected RPC:", rpc); 
                        setSelectedRpc(rpc)
                      }}
                    /> */}

                  <input
                      key={`${chain.name}-${rpc}`}
                      type="radio"
                      className="mr-2"
                      value={rpc}
                      checked={rpc === tempRpc}  // use tempRpc here
                      onChange={(e) => setTempRpc(e.target.value)}  // update tempRpc here
                    />

                    <label htmlFor={`chain${chain.ss58Format}`} className="ml-2 text-black">
                      {rpc}
                    </label>
                  </div>
                ))}
                     <button
                        onClick={() => {
                          handleRpcSelection(tempRpc);  // use tempRpc here
                          setOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
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


