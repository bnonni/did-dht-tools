import { Did } from '../src/index.js';
import version from '../src/bin/version.js';
const {TOOL5_HOME} = version;

const endpoint = 'https://dwn.tbddev.org/beta';
const gateway = 'https://diddht.tbddev.org';
const out = `${TOOL5_HOME}/did/create`;
const did = await Did.create({endpoint, gateway, out});
console.log(`Created DID: ${did.uri}`);