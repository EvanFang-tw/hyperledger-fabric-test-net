import { Contract } from 'fabric-contract-api';
import { IContext } from './interfaces/IContext';

export class App extends Contract {

  // Get value by key
  public async get(ctx: IContext, key: string): Promise<string> {
    const data = await ctx.stub.getState(key);
    if (data.length === 0) {
      return '';
    }
    return data.toString();
  }

  // Set value with key
  public async set(ctx: IContext, key: string, value: string): Promise<string> {
    await ctx.stub.putState(key, Buffer.from(value));
    return ctx.stub.getTxID();
  }

  // Get chaincode invoker's MSP ID
  public async getMSPID(ctx: IContext): Promise<string> {
    return ctx.clientIdentity.getMSPID();
  }
}
