import { X509 } from 'fabric-shim';

export interface IClientIdentity {
  assertAttributeValue(attrName: string, attrValue: string): boolean;
  getAttributeValue(attrName: string): string | null;
  getID(): string;
  getMSPID(): string;
  getX509Certificate(): X509.Certificate;
}
