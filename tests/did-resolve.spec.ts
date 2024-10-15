import { Did } from '../src/index.js';

import version from '../src/bin/version.js';
const {TOOL5_HOME} = version;

const did = 'did:dht:1o97ymdahpcnyx83ci6w5nxfqd5znuhz5bm7wa7ms8oxtou3iabo';
const gateway = 'https://diddht.tbddev.org';
const out = `${TOOL5_HOME}/did/resolve`;
const resolve = await Did.resolve({did, gateway, out});
console.log(`Resolved DID: ${resolve}`);