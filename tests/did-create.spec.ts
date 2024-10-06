import { Did } from '../src/index.js';

const TOOL5_HOME = process.env.TOOL5_HOME ?? `${process.env.HOME}/.tool5`;

const endpoint = 'https://dwn.tbddev.org/beta';
const gateway = 'https://diddht.tbddev.org';
const out = `${TOOL5_HOME}/did/create`;
const did = await Did.create({endpoint, gateway, out});
console.log(`Created DID: ${did.uri}`);