import { Iterators } from 'fabric-shim';
// import { SerializedIdentity, ChaincodeProposal, StateQueryResponse, ChaincodeResponse, SplitCompositekey } from 'fabric-shim';
// import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export interface IChaincodeStub {
  // getArgs(): string[];
  // getStringArgs(): string[];
  // getFunctionAndParameters(): { params: string[], fcn: string };

  getTxID(): string;
  // getChannelID(): string;
  // getCreator(): SerializedIdentity;
  // getTransient(): Map<string, Buffer>;

  // getSignedProposal(): ChaincodeProposal.SignedProposal;
  // getTxTimestamp(): Timestamp;
  // getBinding(): string;

  getState(key: string): Promise<Buffer>;
  putState(key: string, value: Buffer): Promise<void>;
  // deleteState(key: string): Promise<void>;
  // setStateValidationParameter(key: string, ep: Buffer): Promise<void>;
  // getStateValidationParameter(key: string): Promise<Buffer>;
  // getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
  // getStateByRangeWithPagination(startKey: string, endKey: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
  // getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
  // getStateByPartialCompositeKeyWithPagination(objectType: string, attributes: string[], pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;

  // getQueryResult(query: string): Promise<Iterators.StateQueryIterator>;
  // getQueryResultWithPagination(query: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
  getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator>;

  // invokeChaincode(chaincodeName: string, args: string[], channel: string): Promise<ChaincodeResponse>;
  // setEvent(name: string, payload: Buffer): void;

  createCompositeKey(objectType: string, attributes: string[]): string;
  // splitCompositeKey(compositeKey: string): SplitCompositekey;

  // getPrivateData(collection: string, key: string): Promise<Buffer>;
  // putPrivateData(collection: string, key: string, value: Buffer): Promise<void>;
  // deletePrivateData(collection: string, key: string): Promise<void>;
  // setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
  // getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;
  // getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
  // getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
  // getPrivateDataQueryResult(collection: string, query: string): Promise<Iterators.StateQueryIterator>;
}
