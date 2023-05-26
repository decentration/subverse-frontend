import React, { useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { testChainConnection } from '../utils/testUtils';

const Settings: React.FC = () => {
  const [endpoint, setEndpoint] = useState('wss://soupcan1.jelliedowl.com');
  const [output, setOutput] = useState('');

const handleTestChainConnection = async () => {
  // Clear the output
  setOutput('');

  try {
    // Create a new Api instance with our endpoint
    const provider = new WsProvider(endpoint);
    const api = await ApiPromise.create({ provider });

    // Wait until we are ready and connected
    await api.isReady;

    // Now we know we are ready and connected, we can retrieve the chain's name and the latest block information
    const chainName = await api.rpc.system.chain();
    const lastHeader = await api.rpc.chain.getHeader();

    // Use template literals to create a formatted string
    const outputMessage = `${chainName}: last block #${lastHeader.number} has hash ${lastHeader.hash}`;

    // Log the information
    console.log(outputMessage);

    // Run the test and capture the console output
    let oldConsoleLog = console.log;
    console.log = (message?: any, ...optionalParams: any[]) => {
      setOutput((prevOutput) => prevOutput + '\n' + message);
    };
    await testChainConnection(api);
    console.log = oldConsoleLog;

    // Add the chain name and block info to the output
    setOutput((prevOutput) => prevOutput + '\n' + outputMessage);

  } catch (error) {
    console.error(error);
    setOutput(`Error: ${(error as Error).message}`);
  }
};

  
  
  

  return (
    <div>
      <label>
        Endpoint:
        <input type="text" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
      </label>
      <button onClick={handleTestChainConnection}>Test Chain Connection</button>
      <pre>{output}</pre>
    </div>
  );
};

export default Settings;
