/* tslint:disable:ban-types */ // Allow Function[] as return type

import { Iterators } from 'fabric-shim';
import { KeyRecord } from './KeyRecord';
import { NextKeyModificationResult } from './NextKeyModificationResult';
import { KeyResult } from './KeyResult';

export class HistoryQueryIterator implements Iterators.HistoryQueryIterator {

  // Current index
  private index: number = -1;
  private history: KeyRecord[];

  constructor(history: KeyRecord[]) {
    this.history = history;
  }

  public async next(): Promise<Iterators.NextKeyModificationResult> {
    // Check if all record is read by comparing the current index and length of records.
    if (this.index >= this.history.length - 1) {
      return Promise.resolve({
        done: true,
        value: null,
      });
    }

    // Move to next
    ++this.index;

    // Get record from history
    const record = this.history[this.index];

    const keyResult = new KeyResult(record.txid, record.value, record.timestamp, record.isDelete);

    const result = new NextKeyModificationResult(keyResult, false);
    return Promise.resolve(result);
  }

  public close(): Promise<void> {
    this.index = -1;
    return;
  }

  public addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public on(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public once(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public off(event: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.');
  }
  public removeAllListeners(event?: string | symbol): this {
    throw new Error('Method not implemented.');
  }
  public setMaxListeners(n: number): this {
    throw new Error('Method not implemented.');
  }
  public getMaxListeners(): number {
    throw new Error('Method not implemented.');
  }
  public listeners(event: string | symbol): Function[] {
    throw new Error('Method not implemented.');
  }
  public rawListeners(event: string | symbol): Function[] {
    throw new Error('Method not implemented.');
  }
  public emit(event: string | symbol, ...args: any[]): boolean {
    throw new Error('Method not implemented.');
  }
  public eventNames(): Array<(string | symbol)> {
    throw new Error('Method not implemented.');
  }
  public listenerCount(type: string | symbol): number {
    throw new Error('Method not implemented.');
  }
}
