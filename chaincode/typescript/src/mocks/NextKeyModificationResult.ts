import { Iterators } from 'fabric-shim';

export class NextKeyModificationResult implements Iterators.NextKeyModificationResult {

  public value: Iterators.KeyModification;
  public done: boolean;

  constructor(value: Iterators.KeyModification, done: boolean) {
    this.value = value;
    this.done = done;
  }
}
