import { BearerDid, DidDht, DidDocument, DidJwk, DidJwkCreateOptions, DidVerificationMethod, DidWeb, PortableDid } from '@web5/dids';
import { Logger } from '../index.js';
import { CryptoApi, JwkType, LocalKeyManager } from '@web5/crypto';
import { Web5UserAgent } from '@web5/user-agent';
import { AgentDidApi, AgentDidResolverCache, DwnDidStore } from '@web5/agent';
// import { DidUtils } from '../utils/did-utils.js';
export type DidParams = { gateway: string; out: string; };
export type DidCreateParams = DidParams & { endpoint: string; };
export type DidPublishParams = DidParams & { did: BearerDid; };
export type DidPublishPortableParams = DidParams & { did: string; };
export type DidResolveParams = DidParams & { did: string; };
const webPortable = {
  'uri'      : 'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ',
  'document' : {
    '@context': [
      'https://www.w3.org/ns/did/v1'
    ],
    'id'                 : 'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ',
    'verificationMethod' : [
      {
        'id'           : 'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0',
        'type'         : 'JsonWebKey',
        'controller'   : 'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ',
        'publicKeyJwk' : {
          'crv' : 'Ed25519',
          'kty' : 'OKP' as JwkType,
          'x'   : 'qIzGZ06QEki_LSNP0IioASepbmze2gmsi5z3X3KvUsE',
          'kid' : '1FXZkZkPIEAvNlEjo_Iuc4G5yG-YmYOnCw5naWaFgrM',
          'alg' : 'EdDSA'
        }
      }
    ],
    'authentication': [
      'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0'
    ],
    'assertionMethod': [
      'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0'
    ],
    'capabilityInvocation': [
      'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0'
    ],
    'capabilityDelegation': [
      'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0'
    ],
    'keyAgreement': [
      'did:web:eyJjcnYiOiJFZDI1NTE5Iiwia3R5IjoiT0tQIiwieCI6InFJekdaMDZRRWtpX0xTTlAwSWlvQVNlcGJtemUyZ21zaTV6M1gzS3ZVc0UiLCJraWQiOiIxRlhaa1prUElFQXZObEVqb19JdWM0RzV5Ry1ZbVlPbkN3NW5hV2FGZ3JNIiwiYWxnIjoiRWREU0EifQ#0'
    ]
  },
  'metadata': {
    published: true
  },
  'privateKeys': [
    {
      'crv' : 'Ed25519',
      'd'   : 'pAExqzFjGtJ-htq9VT9V4Ft1WZqsJpQBGkkhmxlH0pw',
      'kty' : 'OKP' as JwkType,
      'x'   : 'qIzGZ06QEki_LSNP0IioASepbmze2gmsi5z3X3KvUsE',
      'kid' : '1FXZkZkPIEAvNlEjo_Iuc4G5yG-YmYOnCw5naWaFgrM',
      'alg' : 'EdDSA'
    }
  ]
};

class DidWebFacade extends DidWeb {
  public static async create<TKms extends CryptoApi | undefined = undefined>({ keyManager = new LocalKeyManager(), options = {} }: {
    keyManager?: TKms;
    options?: DidJwkCreateOptions<TKms>;
  } = {}): Promise<BearerDid> {
    throw new Error('Method not implemented.' + keyManager + options);
  }

  public static async getSigningMethod({ didDocument }: {
    didDocument: DidDocument;
    methodId?: string;
  }): Promise<DidVerificationMethod> {
    throw new Error('Method not implemented.' + didDocument);
  }
}

const webBearer = await BearerDid.import({ portableDid: webPortable });
Logger.log('webBearer', webBearer);
const didApi = new AgentDidApi({
  didMethods    : [DidDht, DidJwk, DidWebFacade],
  resolverCache : new AgentDidResolverCache({ location: `DATA/WEB/DID_RESOLVERCACHE` }),
  store         : new DwnDidStore()
});
const agent = await Web5UserAgent.create({ dataPath: 'DATA/WEB/AGENT', didApi });
Logger.log('agent', agent);

// export class Did extends DidUtils {
//   public static async importPortable({ portableDid }: { portableDid: PortableDid }) {
//     return await DidDht.import({ portableDid });
//   }

//   public static async createWeb() {
//     const bearerJwk = await DidJwk.create();
//     const portableJwk = await key.export();

//     const bearerDid = new BearerDid({
//       uri      : 'did:web:nonni.org',
//       document : {
//         id             : 'did:web:nonni.org',
//         publicKey      : [],
//         authentication : [],
//         service        : [
//           {
//             'id'              : 'did:web:nonni.org',
//             'type'            : 'DecentralizedWebNode',
//             'serviceEndpoint' : [
//               'https://dwn.nonni.org/'
//             ],
//             'enc' : '#enc',
//             'sig' : '#sig'
//           }
//         ],
//       },
//     });
//   }

//   public static async create({ endpoint, gateway, out }: DidCreateParams) {
//     const bearerDid = await DidDht.create({options: { gatewayUri: gateway }});
//     bearerDid.document.service = [
//       {
//         'id'              : bearerDid.uri,
//         'type'            : 'DecentralizedWebNode',
//         'serviceEndpoint' : [endpoint],
//         'enc'             : '#enc',
//         'sig'             : '#sig'
//       }
//     ];
//     out = `${out}/${bearerDid.uri}`;
//     await Did.publishBearer({ did: bearerDid, gateway, out });
//     const portableDid = await bearerDid.export();
//     await DidUtils.writeDid({out, portableDid});
//     Logger.info(`[create] created did ${portableDid.uri} - saved public document to ${out}/did.json - saved private document to ${out}/portable-did.json`);
//     return bearerDid;
//   }

//   public static async publish({ did, gateway, out }: DidPublishParams) {
//     out = `${out}/${did.uri}`;
//     const didRegistration = await DidDht.publish({ did, gatewayUri: gateway });
//     await DidUtils.writePublish({out, didRegistration});
//     const portableDid = await did.export();
//     await DidUtils.writeDid({out, portableDid});
//     return portableDid.uri;
//   }

//   public static async resolve({ did, gateway, out }: DidResolveParams) {
//     out = `${out}/${did}`;
//     const didResolution = await DidDht.resolve(did, { gatewayUri: gateway });
//     await Did.writeResolution(out, didResolution);
//     Logger.info(`[resolve] resolved did ${did} - saved to ${out}/did.json`);
//     return did;
//   }
// }
