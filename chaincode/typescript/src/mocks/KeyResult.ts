/* tslint:disable:variable-name */ // Allow underscore variable name
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export class KeyResult {
  public is_delete: boolean;
  public tx_id: string;
  public timestamp: Timestamp;
  public value: Buffer;

  constructor(tx_id: string, value: Buffer, timestamp: Timestamp, is_delete: boolean) {
    this.is_delete = is_delete;
    this.tx_id = tx_id;
    this.timestamp = timestamp;
    this.value = value;
  }

  public getIsDelete() {
    return this.is_delete;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getTxId() {
    return this.tx_id;
  }

  public getValue() {
    return this.value;
  }
}
