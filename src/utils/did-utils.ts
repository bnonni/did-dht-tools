import { BearerDid, DidDht, DidDocument, PortableDid } from '@web5/dids';
import { mkdir } from 'fs/promises';
import { DidPublishParams } from '../primitives/did.js';
import { Files, stringifier } from './files.js';
import { Logger } from './logger.js';

export class DidUtils {
  protected static async publishBearer({ did, out, gateway }: DidPublishParams) {
    if(!(did instanceof BearerDid)) {
      Logger.error('DID must be BearerDid');
      throw new Error('Did must be BearerDid');
    }
    const didRegistration = await DidDht.publish({ did, gatewayUri: gateway });
    const { didRegistrationMetadata, didDocument, didDocumentMetadata } = didRegistration;
    await Files.write(`${out}/didRegistrationMetadata.json`, stringifier(didRegistrationMetadata));
    await Files.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
    return await did.export();
  }

  protected static async publishPortable({ did, out, gateway }: DidPublishParams) {
    if(did instanceof BearerDid) {
      Logger.error('DID must be string path, not BearerDid');
      throw new Error('DID must be string path, not BearerDid');
    }
    const portableDid = await Files.readToJson(did);
    const bearerDid = await DidDht.import({ portableDid });
    const didRegistration = await DidDht.publish({ did: bearerDid, gatewayUri: gateway });
    const { didRegistrationMetadata, didDocument, didDocumentMetadata } = didRegistration;
    await Files.write(`${out}/didRegistrationMetadata.json`, stringifier(didRegistrationMetadata));
    await Files.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
    return did;
  }

  protected static async writeDid({out, portableDid}: {out: string, portableDid: PortableDid}){
    await Files.mkdir(out, { recursive: true });
    await Files.write(`${out}/portable-did.json`, stringifier(portableDid));
    await DidUtils.writeDidDocument(out, portableDid.document);
  }

  protected static async writeDidResolution(out: string, didResolution: any){
    await mkdir(out, { recursive: true });
    const { didResolutionMetadata, didDocument, didDocumentMetadata } = didResolution;
    await Files.write(`${out}/didResolution.json`, stringifier(didResolution));
    await Files.write(`${out}/didResolutionMetadata.json`, stringifier(didResolutionMetadata));
    await Files.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
  }

  protected static async writeDidDocument(out: string, didDoc: DidDocument | null){
    if(!didDoc) {
      Logger.error('DidDocument is null');
      throw new Error('DidDocument is null');
    };
    await Files.write(`${out}/did.json`, stringifier(didDoc));
  }
}