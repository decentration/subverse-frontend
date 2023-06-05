// __mocks__/@polkadot/api.js

const mockRpcSystemChain = jest.fn(async () => 'Mock Chain');
const mockRpcSystemSs58Format = jest.fn(() => 42);

class MockApiPromise {
  static async create({ provider }) {
    return new MockApiPromise(provider);
  }

  constructor(provider) {
    this.rpc = {
      system: {
        chain: mockRpcSystemChain,
      },
    };

    this.consts = {
      system: {
        ss58Format: {
          toString: mockRpcSystemSs58Format,
        },
      },
    };
  }

  disconnect() {
    // Mock disconnect
  }
}

class MockWsProvider {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }
}

module.exports = {
  ApiPromise: MockApiPromise,
  WsProvider: MockWsProvider,
  mockRpcSystemChain,
  mockRpcSystemSs58Format,
};
