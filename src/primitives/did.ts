import { BearerDid, DidDht } from '@web5/dids';
import { Logger } from '../index.js';
import { DidUtils } from '../utils/did-utils.js';

export type DidParams = { gateway: string; out: string; };
export type DidCreateParams = DidParams & { endpoint: string; };
export type DidPublishParams = DidParams & { did: BearerDid; };
export type DidResolveParams = DidParams & { did: string; };

export class Did extends DidUtils {
  public static async create({ endpoint, gateway, out }: DidCreateParams) {
    const bearerDid = await DidDht.create({options: { gatewayUri: gateway }});
    bearerDid.document.service = [
      {
        'id'              : bearerDid.uri,
        'type'            : 'DecentralizedWebNode',
        'serviceEndpoint' : [endpoint],
        'enc'             : '#enc',
        'sig'             : '#sig'
      }
    ];
    out = `${out}/${bearerDid.uri}`;
    await Did.publish({ did: bearerDid, gateway, out });
    const portableDid = await bearerDid.export();
    await DidUtils.writeDid({out, portableDid});
    Logger.info(`[create] created did ${portableDid.uri} - saved public document to ${out}/did.json - saved private document to ${out}/portable-did.json`);
  }

  public static async publish({ did, gateway, out }: DidPublishParams) {
    out = `${out}/${did}`;
    const portableDid = did instanceof BearerDid
      ? await Did.publishBearer({ did, gateway, out })
      : await Did.publishPortable({ did, gateway, out });
    Logger.info(`[publish] published did ${portableDid.uri} - saved to ${out}/did.json`);
  }

  public static async resolve({ did, gateway, out }: DidResolveParams) {
    const didResolution = await DidDht.resolve(did, { gatewayUri: gateway });
    await Did.writeDidResolution(out, didResolution);
    Logger.info(`[resolve] resolved did ${did} - saved to ${out}/did.json`);
  }
}
