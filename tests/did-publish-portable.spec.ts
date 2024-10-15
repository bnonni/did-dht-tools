import { Did } from '../src/index.js';

import version from '../src/bin/version.js';
const {TOOL5_HOME} = version;
const gateway = 'https://diddht.tbddev.org';
const out = `${TOOL5_HOME}/did/publish`;
const did = `${out}/did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo/portable-did.json`;
const publish = await Did.publishPortable({ did, gateway, out });
console.log(`Published DID: ${publish}`);