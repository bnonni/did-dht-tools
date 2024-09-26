import { BearerDid, DidDht } from '@web5/dids';
import crypto from 'crypto';
import { DidUtils } from '../utils/did-utils.js';
import { Logger } from '../index.js';

type OptionalDidOptions = { out?: string; gatewayUri?: string };

export class Did extends DidUtils {
  public static out: string = crypto.randomUUID().toUpperCase();

  protected static logPortableDid() {
    Logger.security('portable-did.json: CONTAINS PRIVATE KEYS! Keep it private and safe!');
  }

  protected static logDid(out?: string) {
    out ??= './out/did/';
    Logger.info('did.json: Publicly available. Host it in .well-know: mywebsite.com/.well-known/did.json');
    Logger.info(`DID document saved to ${out}/did.json`);
  }

  protected static logBoth(out?: string) {
    Did.logPortableDid();
    Did.logDid(out);
  }

  public static async create(out: string, dwnEndpoint?: string) {
    out ??= `out/did/create/${out}`;
    dwnEndpoint ??= 'https://dwn.nonni.org/';
    const bearerDid = await DidDht.create();
    bearerDid.document.service = [
      {
        'id'              : bearerDid.uri,
        'type'            : 'DecentralizedWebNode',
        'serviceEndpoint' : [dwnEndpoint],
        'enc'             : '#enc',
        'sig'             : '#sig'
      }
    ];
    await Did.publish(bearerDid, { out });
    const portableDid = await bearerDid.export();
    await DidUtils.writeDidCreation(out, portableDid);
    Logger.info(`DID ${portableDid.uri} Created Succesfully`);
    Did.logBoth(out);
  }

  public static async publish(did: string | BearerDid, { out, gatewayUri }: OptionalDidOptions) {
    gatewayUri ??= 'https://diddht.tbddev.org';
    const portableDid = did instanceof BearerDid
      ? await Did.publishBearer({ did, gatewayUri, out: `out/did/publish/${out}` })
      : await Did.publishFromPath({ didPath: did, out: `out/did/publish/${did}`, gatewayUri });
    Logger.info(`Published DID ${portableDid.uri} Successfully`);
    Did.logDid(out);
  }

  public static async resolve(didUri: string, { out, gatewayUri }: OptionalDidOptions) {
    out ??= `out/did/resolve/${didUri}`;
    gatewayUri ??= 'https://diddht.tbddev.org';
    const didResolution = await DidDht.resolve(didUri, { gatewayUri });
    await Did.writeDidResolution(out, didResolution);
    Logger.info(`Resolved DID ${didUri} Successfully`);
    Did.logDid(out);
  }
}
