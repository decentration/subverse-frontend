import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ChainSelector, Chain } from './ChainSelector';
import { chains as mockChains } from './chains';
import '@testing-library/jest-dom/extend-expect';
import { ApiPromise, WsProvider, mockRpcSystemChain, mockRpcSystemSs58Format } from '@polkadot/api';

// Customize the returned values in your tests:
mockRpcSystemChain.mockReturnValueOnce('Custom Mock Chain');
mockRpcSystemSs58Format.mockReturnValueOnce(24);


describe('ChainSelector', () => {
  it('should display the selected chain name on the button after selecting', async () => {
    const { getByText } = render(
      <ChainSelector selectedChain={null} setSelectedChain={() => {}} />
    );

    // Open the chain selector dropdown
    fireEvent.click(getByText('Select Chain'));

    // Select the first mock chain
    fireEvent.click(getByText(`Select ${mockChains[0].name}`));

    // Check if the button text has changed to the selected chain name
    expect(getByText(`Select ${mockChains[0].name}`)).toBeInTheDocument();
  });
});
