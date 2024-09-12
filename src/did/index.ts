import { FileSystem, Logger } from '@dcx-protocol/common';
import { BearerDid, DidDht, DidResolutionOptions } from '@web5/dids';
import crypto from 'crypto';
import { mkdir } from 'fs/promises';

export class Did {
  public static async create(dwnEndpoint?: string, dataPath?: string) {
    dwnEndpoint ??= 'https://dwn.tbddev.org/beta';
    dataPath ??= `out/${crypto.randomUUID().toUpperCase()}`;
    if(dataPath){
      await mkdir(dataPath, { recursive: true });
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
    await Did.publish(bearerDid);
    const portableDid = await bearerDid.export();
    await FileSystem.write(`${dataPath}/did.json`, JSON.stringify(bearerDid, null, 2));
    await FileSystem.write(`${dataPath}/portable-did.json`, JSON.stringify(portableDid, null, 2));
    Logger.info(`DID Created Succesfully: ${dataPath}`);
    Logger.info('Keep portable-did.json private and safe');
    Logger.info('Host did.json in a public location (e.g. mywebsite.com/.well-known/did.json)');
  }

  public static async publish(did: BearerDid, gatewayUri?: string) {
    gatewayUri ??= 'https://diddht.tbddev.org';
    await DidDht.publish({ did, gatewayUri });
    Logger.info('Published DID Successfully');
  }

  public static async resolve(didUri: string, options?: DidResolutionOptions) {
    options ??= {};
    DidDht.resolve(didUri, options);
  }
}