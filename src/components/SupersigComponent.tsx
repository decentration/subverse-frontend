import React, { useEffect, useState } from 'react';
import { encodeAddress } from '@polkadot/util-crypto';
import { ApiPromise } from '@polkadot/api';
import { setupSuperSigApi } from '../api/apiSetup'; // adjust the path as necessary

const SuperSigComponent: React.FC = () => {
  const [api, setApi] = useState<ApiPromise | null>(null);

  useEffect(() => {
    // Call the setup function to create an instance of the API
    setupSuperSigApi('wss://soupcan1.jelliedowl.com').then(apiInstance => {
      // Save the instance for use in other parts of your application
      setApi(apiInstance);
    });
  }, []);

  useEffect(() => {
    if (api) {
      // Perform actions with the api instance
    }
  }, [api]);

  return <div>SuperSig Component</div>;
};

export default SuperSigComponent;
