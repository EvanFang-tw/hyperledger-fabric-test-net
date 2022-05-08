import 'mocha';
import { ClientIdentity } from '../../src/mocks/ClientIdentity';
import { expect } from 'chai';

describe('ClientIdentity', () => {

  const client = new ClientIdentity();
  describe('assertAttributeValue', () => {
    it('should work', () => {
      expect(client.assertAttributeValue('hf.EnrollmentID', 'user')).equals(true);
      expect(client.assertAttributeValue('hf.EnrollmentID', 'foo')).equals(false);
      expect(client.assertAttributeValue('hf.foo', 'foo')).equals(false);
    });
  });

  describe('getAttributeValue', () => {
    it('should work', () => {
      expect(client.getAttributeValue('hf.EnrollmentID')).equals('user');
    });
  });

  describe('getID', () => {
    it('should work', () => {
      expect(client.getID()).to.be.a('string');
      expect(client.getID()).contains('CN=');
    });
  });

  describe('getMSPID', () => {
    it('should work', () => {
      expect(client.getMSPID()).equals('Org1MSP');
    });
  });

  describe('ClientIdentity', () => {
    it('should work', () => {
      expect(client.getX509Certificate()).to.be.an('object');
    });
  });
});
