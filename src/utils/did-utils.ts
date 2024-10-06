import { BearerDid, DidDht, DidDocument, DidRegistrationResult, PortableDid } from '@web5/dids';
import { mkdir } from 'fs/promises';
import { DidPublishParams, DidPublishPortableParams } from '../primitives/did.js';
import { Files, stringifier } from './files.js';
import { Logger } from './logger.js';

export class DidUtils {
  public static async publishBearer({ did, out, gateway }: DidPublishParams) {
    if(!(did instanceof BearerDid)) {
      throw new Error('Did must be BearerDid');
    }
    const didRegistration = await DidDht.publish({ did, gatewayUri: gateway });
    await DidUtils.writePublish({out, didRegistration});
    const portableDid = await did.export();
    await DidUtils.writeDid({out, portableDid});
    return portableDid;
  }

  public static async publishPortable({ did, out, gateway }: DidPublishPortableParams) {
    if(typeof did !== 'string') {
      throw new Error('DID must be string path');
    }
    const portableDid = await Files.readToJson(did);
    const bearerDid = await DidDht.import({ portableDid });
    const didRegistration = await DidDht.publish({ did: bearerDid, gatewayUri: gateway });
    await DidUtils.writePublish({out, didRegistration});
    await DidUtils.writeDid({out, portableDid});
    return did;
  }

  public static async writeDid({out, portableDid}: {out: string, portableDid: PortableDid}){
    await Files.mkdir(out, { recursive: true });
    await Files.write(`${out}/did.json`, stringifier(portableDid.document));
    await Files.write(`${out}/portable-did.json`, stringifier(portableDid));
  }

  public static async writePublish({out, didRegistration}: {out: string, didRegistration: DidRegistrationResult}){
    await Files.mkdir(out, { recursive: true });
    const { didRegistrationMetadata, didDocumentMetadata } = didRegistration;
    await Files.write(`${out}/didRegistrationMetadata.json`, stringifier(didRegistrationMetadata));
    await Files.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
  }

  public static async writeResolution(out: string, didResolution: any){
    await mkdir(out, { recursive: true });
    const { didResolutionMetadata, didDocument, didDocumentMetadata } = didResolution;
    await Files.write(`${out}/didResolution.json`, stringifier(didResolution));
    await Files.write(`${out}/didResolutionMetadata.json`, stringifier(didResolutionMetadata));
    await Files.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
  }

  public static async writeDidDocument(out: string, didDoc: DidDocument | null){
    if(!didDoc) {
      Logger.error('DidDocument is null');
      throw new Error('DidDocument is null');
    };
    await Files.write(`${out}/did.json`, stringifier(didDoc));
  }
}