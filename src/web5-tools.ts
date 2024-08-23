import dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@dcx-protocol/common';
import { program } from 'commander';
import { Did } from './did/index.js';
import { Dwn } from './dwn/index.js';
import { Vc } from './vc/index.js';

const validateAction = (value: string) => {
  const [primitive, action] = value.split(':');
  if(primitive === 'did' && !['create', 'publish', 'recover'].includes(action)) {
    console.error('Invalid action for did: must be one of create, publish, or recover');
    process.exit(1);
  }
  if(primitive === 'vc' && !['create', 'verify'].includes(action)) {
    console.error('Invalid action for vc: must be one of create or verify');
    process.exit(1);
  }
  if(primitive === 'dwn' && !['create', 'read', 'update', 'delete'].includes(action)) {
    console.error('Invalid action for dwn: must be one of create, read, update, or delete');
    process.exit(1);
  }
  return value;
};

const validateParseOptions = (value: string) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Invalid JSON for -o, --options flag');
    process.exit(1);
  }
};

program
  .requiredOption('-p, --primitive <did|vc|dwn>', 'Web5 primitive to interact with', 'did')
  .requiredOption('-a, --action <create|publish|recover|verify|read|update|delete>', 'action to take on Web5 primitive', validateAction, 'create')
  .option('-o, --options <json>', 'options to pass to the did creation', validateParseOptions, { dwnEndpoints: ['https://dwn.tbddev.org/beta'] });
program.parse();

const opts = program.opts();

const primitive = opts.primitive.trim().toLowerCase();
const action = opts.action.trim().toLowerCase();
const options = opts.options;

console.log(primitive, action, options);
switch(primitive) {
  case 'did':
    switch(action) {
      case 'create':
        await Did.create(options);
        break;
      case 'publish':
        Logger.log('Publishing a DID');
        await Did.publish();
        break;
      case 'recover':
        Logger.log('Publishing a DID');
        await Did.publish();
        break;
      default:
        Logger.log('Invalid action for did: must be one of create, publish, or recover');
    }
    break;
  case 'vc':
    switch(action) {
      case 'create':
        Logger.log('Creating a VC');
        await Vc.create();
        break;
      case 'verify':
        Logger.log('Verifying a VC');
        await Vc.verify();
        break;
      default:
        Logger.log('Invalid action for vc: must be one of create or verify');
    }
    break;
  case 'dwn':
    switch(action) {
      case 'create':
        Logger.log('Creating a dwn record');
        await Dwn.create();
        break;
      case 'read':
        Logger.log('Reading a dwn record');
        await Dwn.read();
        break;
      case 'update':
        Logger.log('Updating a dwn record');
        await Dwn.update();
        break;
      case 'delete':
        Logger.log('Deleting a dwn record');
        await Dwn.delete();
        break;
      default:
        Logger.log('Invalid action for dwn: must be one of create, read, update, or delete');
    }
    break;
  default:
    Logger.log('Invalid primitive: must be one of did, vc, or dwn');
}