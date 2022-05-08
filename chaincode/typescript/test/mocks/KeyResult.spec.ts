import { KeyResult } from '../../src/mocks/KeyResult';
import { TxidHelper } from '../../src/mocks/helpers/TxidHelper';
import { TimestampHelper } from '../../src/mocks/helpers/TimestampHelper';
import { expect } from 'chai';

describe('KeyResult', () => {
  it('should work', () => {
    // Arrange
    const txID = (new TxidHelper()).generate();
    const value = Buffer.from('value');
    const timestamp = (new TimestampHelper()).now();
    const isDelete = true;

    const keyReuslt = new KeyResult(txID, value, timestamp, isDelete);

    // Action
    const actualTxID = keyReuslt.getTxId();
    const actualValue = keyReuslt.getValue();
    const actualTimestamp = keyReuslt.getTimestamp();
    const actualIsDelete = keyReuslt.getIsDelete();

    // Assert
    expect(actualTxID).equals(txID);
    expect(actualValue).equals(value);
    expect(actualTimestamp).equals(actualTimestamp);
    expect(actualIsDelete).equals(isDelete);
  });
});
