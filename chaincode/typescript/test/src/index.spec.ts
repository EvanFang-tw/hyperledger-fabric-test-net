import { expect } from 'chai';
import { contracts } from '../../src/index';
import { describe, it } from 'mocha';

describe('index', () => {
  describe('contracts', () => {
    it('should be an array and contains only one element of App', () => {
      expect(contracts).to.be.an('Array').that.has.lengthOf(1);
      expect(contracts[0].name).equals('App');
    });
  });
});
