import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export class KeyRecord {

  public txid: string;
  public key: string;
  public value: Buffer;
  public timestamp: Timestamp;
  public isDelete: boolean;

  constructor(txid: string, key: string, value: Buffer, timestamp: Timestamp, isDelete: boolean) {
    this.txid = txid;
    this.key = key;
    this.value = value;
    this.timestamp = timestamp;
    this.isDelete = isDelete;
  }
}
