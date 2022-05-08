import { IClientIdentity } from '../interfaces/IClientIdentity';
import { X509 } from 'fabric-shim';

export class ClientIdentity implements IClientIdentity {

  private attrs = {
    'hf.EnrollmentID': 'user',
  };

  public assertAttributeValue(attrName: string, attrValue: string): boolean {
    if (this.attrs[attrName] && this.attrs[attrName] === attrValue) {
      return true;
    }
    return false;
  }

  public getAttributeValue(attrName: string): string {
    return this.attrs[attrName];
  }

  public getID(): string {
    return 'x509::/OU=client+OU=org1+OU=department1/CN=user::/C=US/ST=California/L=San Francisco/O=org1.example.com/CN=ca.org1.example.com';
  }

  public getMSPID(): string {
    return 'Org1MSP';
  }

  public getX509Certificate(): X509.Certificate {
    const cert = {
      version: 2,
      subject: {
        countryName: '',
        postalCode: '',
        stateOrProvinceName: '',
        localityName: '',
        streetAddress: '',
        organizationName: '',
        organizationalUnitName: 'department1',
        commonName: 'user',
      },
      issuer:
      {
        countryName: 'US',
        stateOrProvinceName: 'California',
        localityName: 'San Francisco',
        organizationName: 'org1.example.com',
        commonName: 'ca.org1.example.com',
      },
      serial: '2E0534AC85772CCB66AFA2F13245C77791516CEB',
      notBefore: '2019-07-15T03:49:00.000Z',
      notAfter: '2020-07-14T03:54:00.000Z',
      subjectHash: '95f862cb',
      signatureAlgorithm: 'ecdsa-with-SHA256',
      fingerPrint: 'C7:E4:C3:39:AF:D9:D4:59:63:DB:B3:46:4D:8E:79:9F:6A:C3:B1:64',
      publicKey: { algorithm: 'id-ecPublicKey' },
      altNames: [],
      extensions:
      {
        keyUsage: 'Digital Signature',
        basicConstraints: 'CA:FALSE',
        subjectKeyIdentifier: '3D:1D:DD:82:95:13:37:E6:8F:48:52:90:FD:49:3C:66:9D:B6:43:E0',
        authorityKeyIdentifier: 'keyid:42:39:AA:0D:CD:76:DA:EE:B8:BA:0C:DA:70:18:51:D1:45:04:D3:1A:AD:1B:2D:DD:DB:AC:6A:57:36:5E:49:7C', '1.2.3.4.5.6.7.8.1': '{"attrs":{"hf.Affiliation":"org1.department1","hf.EnrollmentID":"user","hf.Type":"client"}}',
      },
    };
    return cert;
  }
}
