import { IChaincodeStub } from '../interfaces/IChaincodeStub';
import { IContext } from '../interfaces/IContext';
import { IClientIdentity } from '../interfaces/IClientIdentity';
import { ChaincodeStub } from './ChaincodeStub';
import { ClientIdentity } from './ClientIdentity';

export class Context implements IContext {
  public clientIdentity: IClientIdentity = new ClientIdentity();
  public stub: IChaincodeStub = new ChaincodeStub();
}
