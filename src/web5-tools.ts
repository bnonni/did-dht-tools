import dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@dcx-protocol/common';
import { program } from 'commander';
import { Did } from './did/index.js';
import { Dwn } from './dwn/index.js';
import { Vc } from './vc/index.js';

program
  .requiredOption('-p, --primitive <did|vc|dwn>', 'core Web5 primitive to interact with')
  .requiredOption('-a, --action <did:{create,publish} | vc:{create,verify} | dwn:{create,read,update,delete}>', 'action to take on that core primitive');

program.parse();

const options = program.opts();

const primitive = options.primitive.trim().toLowerCase();
const action = options.action.trim().toLowerCase();

switch(primitive) {
  case 'did':
    switch(action) {
      case 'create':
        Logger.log('Creating a DID');
        await Did.create();
        break;
      case 'publish':
        Logger.log('Publishing a DID');
        await Did.publish();
        break;
      default:
        Logger.log('Invalid action for did: must be one of create or publish');
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