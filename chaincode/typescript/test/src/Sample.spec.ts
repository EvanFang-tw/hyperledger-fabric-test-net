import 'mocha';
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const expect = chai.expect;
import { Context } from '../../src/mocks/Context';
import { App } from '../../src/App';

describe('Chaincode functions', () => {
  describe('Health check', () => {

    const contract = new App();

    it('should get empty string', async () => {
      const result = await contract.get(new Context(), 'foo');
      expect(result).equal('');
    });

    it('should set message successfully', async () => {
      const context = new Context();
      await contract.set(context, 'foo', 'bar');
      const result = await contract.get(context, 'foo');
      expect(result).equal('bar');
    });
  });
});
