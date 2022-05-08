import { expect } from 'chai';
import { HistoryQueryIterator } from '../../src/mocks/HistoryQueryIterator';

describe('HistoryQueryIterator', () => {
  // Arrange
  const iterator = new HistoryQueryIterator([]);
  // An empty function for unit test
  const listenerFunction = (...args: any[]): void => {
    return;
  };

  it('should have some method NOT implemented', () => {
    expect(() => iterator.addListener('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.on('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.once('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.prependListener('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.prependOnceListener('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.removeListener('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.off('', listenerFunction)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.removeAllListeners('')).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.setMaxListeners(1)).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.getMaxListeners()).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.listeners('')).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.rawListeners('')).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.emit('')).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.eventNames()).to.throw(Error, 'Method not implemented.');
    expect(() => iterator.listenerCount('')).to.throw(Error, 'Method not implemented.');
  });
});
