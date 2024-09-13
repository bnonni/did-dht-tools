import { Logger, stringifier, FileSystem } from '@dcx-protocol/common';
import { BearerDid, DidDht, DidDocument } from '@web5/dids';

type PublishBearerParams = { did: BearerDid; gatewayUri: string; out: string; }
type PublishFromPathParams = { didPath: string, out: string; gatewayUri?: string }

export class DidUtils {
  protected static async publishBearer({ did, out, gatewayUri }: PublishBearerParams) {
    const didRegistration = await DidDht.publish({ did, gatewayUri });
    const { didRegistrationMetadata, didDocument, didDocumentMetadata } = didRegistration;
    await FileSystem.write(`${out}/didRegistrationMetadata.json`, stringifier(didRegistrationMetadata));
    await FileSystem.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
    return await did.export();
  }

  protected static async publishFromPath({ didPath, out, gatewayUri }: PublishFromPathParams) {
    const portableDid = await FileSystem.readToJson(didPath);
    const did = await DidDht.import({ portableDid });
    const didRegistration = await DidDht.publish({ did, gatewayUri });
    const { didRegistrationMetadata, didDocument, didDocumentMetadata } = didRegistration;
    await FileSystem.write(`${out}/didRegistrationMetadata.json`, stringifier(didRegistrationMetadata));
    await FileSystem.write(`${out}/didDocumentMetadata.json`, stringifier(didDocumentMetadata));
    await DidUtils.writeDidDocument(out, didDocument);
    return did;
  }

  protected static async writeDidDocument(out: string, didDoc: DidDocument | null){
    if(!didDoc) {
      Logger.error('DidDocument is null');
      throw new Error('DidDocument is null');
    };
    await FileSystem.write(`${out}/did.json`, stringifier(didDoc));
  }
}