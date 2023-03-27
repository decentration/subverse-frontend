// __mocks__/@polkadot-api.d.ts

declare module '@polkadot/api' {
    export class ApiPromise {
      static create(options: { provider: any }): Promise<ApiPromise>;
      rpc: any;
      consts: any;
      disconnect(): void;
    }
  
    export class WsProvider {
      constructor(endpoint: string);
    }
  
    export const mockRpcSystemChain: jest.Mock;
    export const mockRpcSystemSs58Format: jest.Mock;
  }
  