import randomstring = require('randomstring');

export class TxidHelper {
  public generate(): string {
    const txid = randomstring.generate({
      charset: 'hex',
      length: 64,
    });
    return txid;
  }
}
