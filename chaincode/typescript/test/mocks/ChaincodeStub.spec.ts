import 'mocha';
import { expect } from 'chai';
import { ChaincodeStub } from '../../src/mocks/ChaincodeStub';

describe('Test chaincodeStub', () => {
  //
  describe('createCompositeKey', () => {
    //
    const stub = new ChaincodeStub();
    it('should separate type and attributes with null character', () => {
      // Arrange
      const type = 'myType';
      const attributes = ['attr1', 'attr2'];
      const expectedCompositeKey = 'myType\u0000attr1\u0000attr2';

      // Action
      const actualCompositeKey = stub.createCompositeKey(type, attributes);

      // Assert
      expect(actualCompositeKey).equals(expectedCompositeKey);
    });

    it('should raise error if objectType is empty', () => {
      expect(() => stub.createCompositeKey('', ['attr1', 'attr2'])).to.throw('objectType is required');
    });

    it('should raise error if no attribute passed in', () => {
      expect(() => stub.createCompositeKey('type', null)).to.throw('attribute is required');
      expect(() => stub.createCompositeKey('type', [])).to.throw('attribute is required');
    });
  });
  //
  describe('getHistoryForKey', () => {
    it('should get key history successfully', async () => {
      const stub = new ChaincodeStub();
      // Add key1 and set value 2 times
      stub.putState('key1', Buffer.from('value1_1'));
      stub.putState('key1', Buffer.from('value1_2'));
      stub.putState('key1', Buffer.from('value1_3'));

      const iterator = await stub.getHistoryForKey('key1');

      const record1 = await iterator.next();
      const record2 = await iterator.next();
      const record3 = await iterator.next();

      iterator.close();

      expect(record1.done).equals(false);
      expect(record1.value.value.toString('utf8')).equals('value1_1');

      expect(record2.done).equals(false);
      expect(record2.value.value.toString('utf8')).equals('value1_2');

      expect(record3.done).equals(true);
      expect(record3.value).equals(null);
    });
  });
});
