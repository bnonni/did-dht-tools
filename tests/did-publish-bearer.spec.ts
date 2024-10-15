import { PortableDid } from '@web5/dids';
import { Did } from '../src/index.js';

import version from '../src/bin/version.js';
const {TOOL5_HOME} = version;
const gateway = 'https://diddht.tbddev.org';
const out = `${TOOL5_HOME}/did/publish`;
const portableDid = {
  'uri'      : 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo',
  'document' : {
    'id'                 : 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo',
    'verificationMethod' : [
      {
        'id'           : 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo#0',
        'type'         : 'JsonWebKey',
        'controller'   : 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo',
        'publicKeyJwk' : {
          'crv' : 'Ed25519',
          'kty' : 'OKP',
          'x'   : 'lD_QLHjjWCA8-WV9TYnlcPdxT5fYV9pjq7Hg-MJ5rgM',
          'kid' : 'dCMC_gYy6cxD1VM5s9nd696WhOgzKMkFJQX1qoDYCWg',
          'alg' : 'EdDSA'
        }
      }
    ],
    'authentication': [
      'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo#0'
    ],
    'assertionMethod': [
      'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo#0'
    ],
    'capabilityDelegation': [
      'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo#0'
    ],
    'capabilityInvocation': [
      'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo#0'
    ],
    'service': [
      {
        'id'              : 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo',
        'type'            : 'DecentralizedWebNode',
        'serviceEndpoint' : [
          'https://dwn.tbddev.org/beta'
        ],
        'enc' : '#enc',
        'sig' : '#sig'
      }
    ]
  },
  'metadata': {
    'published' : true,
    'versionId' : '1728197114'
  },
  'privateKeys': [
    {
      'crv' : 'Ed25519',
      'd'   : 'tL0A8BJdDrFdc9G6_M9ZL-QJDQmJ2rLjS_YCy-2Sw90',
      'kty' : 'OKP',
      'x'   : 'lD_QLHjjWCA8-WV9TYnlcPdxT5fYV9pjq7Hg-MJ5rgM',
      'kid' : 'dCMC_gYy6cxD1VM5s9nd696WhOgzKMkFJQX1qoDYCWg',
      'alg' : 'EdDSA'
    }
  ]
} as PortableDid;
const did = await Did.importPortable({ portableDid });
const publish = await Did.publish({ did, gateway, out });
console.log(`Published DID: ${publish}`);