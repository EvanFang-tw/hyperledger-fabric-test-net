import { IChaincodeStub } from '../interfaces/IChaincodeStub';
import { Iterators } from 'fabric-shim';
import { HistoryQueryIterator } from './HistoryQueryIterator';
import { KeyRecord } from './KeyRecord';
import { TxidHelper } from './helpers/TxidHelper';
import { TimestampHelper } from './helpers/TimestampHelper';

export class ChaincodeStub implements IChaincodeStub {
  // Key-Value database
  private data: string[] = [];
  // Key-value modification history
  private history: KeyRecord[] = [];

  public getState(key: string): Promise<Buffer> {
    if (this.data[key] === undefined) {
      return Promise.resolve(Buffer.from(''));
    }
    return Promise.resolve(Buffer.from(this.data[key]));
  }

  public putState(key: string, value: Buffer): Promise<void> {
    //
    this.data[key] = value.toString();

    // Append record to history
    const txid = (new TxidHelper()).generate();
    const timestamp = (new TimestampHelper()).now();
    const newRecord = new KeyRecord(txid, key, value, timestamp, false);

    this.history.push(newRecord);

    return Promise.resolve();
  }

  public createCompositeKey(objectType: string, attributes: string[]): string {
    if (!objectType) {
      throw new Error('objectType is required');
    }
    if (!attributes || attributes.length === 0) {
      throw new Error('attribute is required');
    }
    return objectType + '\u0000' + attributes.join('\u0000');
  }

  public getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator> {
    // Get history for the particular key
    let keyHistory = this.history.filter((record) => {
      return record.key === key;
    });

    // Remove last element(the newest key-value record)
    keyHistory = keyHistory.slice(0, -1);

    const iterator = new HistoryQueryIterator(keyHistory);
    return Promise.resolve(iterator);
  }

  public getTxID(): string {
    return (new TxidHelper()).generate();
  }
}
