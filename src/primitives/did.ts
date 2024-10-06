import { BearerDid, DidDht, PortableDid } from '@web5/dids';
import { Logger } from '../index.js';
import { DidUtils } from '../utils/did-utils.js';

export type DidParams = { gateway: string; out: string; };
export type DidCreateParams = DidParams & { endpoint: string; };
export type DidPublishParams = DidParams & { did: BearerDid; };
export type DidPublishPortableParams = DidParams & { did: string; };
export type DidResolveParams = DidParams & { did: string; };

export class Did extends DidUtils {
  public static async importPortable({ portableDid }: { portableDid: PortableDid }) {
    return await DidDht.import({ portableDid });
  }

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
    await Did.publishBearer({ did: bearerDid, gateway, out });
    const portableDid = await bearerDid.export();
    await DidUtils.writeDid({out, portableDid});
    Logger.info(`[create] created did ${portableDid.uri} - saved public document to ${out}/did.json - saved private document to ${out}/portable-did.json`);
    return bearerDid;
  }

  public static async publish({ did, gateway, out }: DidPublishParams) {
    out = `${out}/${did.uri}`;
    const didRegistration = await DidDht.publish({ did, gatewayUri: gateway });
    await DidUtils.writePublish({out, didRegistration});
    const portableDid = await did.export();
    await DidUtils.writeDid({out, portableDid});
    return portableDid.uri;
  }

  public static async resolve({ did, gateway, out }: DidResolveParams) {
    out = `${out}/${did}`;
    const didResolution = await DidDht.resolve(did, { gatewayUri: gateway });
    await Did.writeResolution(out, didResolution);
    Logger.info(`[resolve] resolved did ${did} - saved to ${out}/did.json`);
    return did;
  }
}
