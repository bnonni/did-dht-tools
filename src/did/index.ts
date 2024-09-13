import { FileSystem, Logger, stringifier } from '@dcx-protocol/common';
import { BearerDid, DidDht } from '@web5/dids';
import crypto from 'crypto';
import { mkdir } from 'fs/promises';
import { DidUtils } from './utils.js';

type OptionalDidOptions = { out?: string; gatewayUri?: string };

export class Did extends DidUtils {
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
    dwnEndpoint ??= 'https://dwn.nonni.org/';
    if(out){
      await mkdir(out, { recursive: true });
    }
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
    await Did.writeDidDocument(out, bearerDid.document);
    await FileSystem.write(`${out}/portable-did.json`, stringifier(portableDid));
    Logger.info(`DID ${portableDid.uri} Created Succesfully`);
    Did.logBoth(out);
  }

  public static async publish(did: string | BearerDid, { out, gatewayUri }: OptionalDidOptions) {
    out ??= `out/did/publish/${crypto.randomUUID().toUpperCase()}`;
    gatewayUri ??= 'https://diddht.tbddev.org';
    const portableDid = did instanceof BearerDid
      ? await Did.publishBearer({ did, gatewayUri, out })
      : await Did.publishFromPath({ didPath: did, out, gatewayUri });
    Logger.info(`Published DID ${portableDid.uri} Successfully`);
    Did.logDid(out);
  }

  public static async resolve(didUri: string, { out, gatewayUri }: OptionalDidOptions) {
    out ??= `out/did/resolve/${crypto.randomUUID().toUpperCase()}`;
    gatewayUri ??= 'https://diddht.tbddev.org';
    const didResolution = await DidDht.resolve(didUri, { gatewayUri });
    const { didResolutionMetadata, didDocument, didDocumentMetadata } = didResolution;
    await FileSystem.write(`${out}/didResolution.json`, stringifier(didResolution));
    await FileSystem.write(`${out}/didResolutionMetadata.json`, stringifier(didResolutionMetadata));
    await FileSystem.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await Did.writeDidDocument(out, didDocument);
    Logger.info(`Resolved DID ${didUri} Successfully`);
    Did.logDid(out);
  }
}
