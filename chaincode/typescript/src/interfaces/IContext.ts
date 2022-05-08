import { IChaincodeStub } from './IChaincodeStub';
import { IClientIdentity } from './IClientIdentity';

// fabric-contract-api: Context
export interface IContext {
  stub: IChaincodeStub;
  clientIdentity: IClientIdentity;
}
