#!/usr/bin/env node

import { Logger } from '@dcx-protocol/common';
import { program } from 'commander';
import { Did } from './did/index.js';
import { Dwn } from './dwn/index.js';
import { Vc } from './vc/index.js';

program
  .command('did')
  .description('Interact with DIDs (Decentralized Identifiers)')
  .option('-a, --action <create|publish|resolve>', 'action to take on the DID')
  .option('-o, --out <path>', 'optional output path for files')
  .option('-e, --endpoint <dwnEndpoint>', 'optional DWN endpoint for DID creation')
  .option('-g, --gateway <gatewayUri>', 'optional gateway URI for publish/resolve')
  .option('-d, --did <did>', 'DID for publish/resolve actions')
  .action(async ({ action, out, endpoint, gateway, did }) => {
    out ??= `out/did/create/${crypto.randomUUID().toUpperCase()}`;
    endpoint ??= 'https://dwn.nonni.org/';
    gateway ??= 'https://diddht.tbddev.org';
    switch(action) {
      case 'create':
        Logger.log(`Creating ${did ?? 'did'}: options={out: ${out}, endpoint: ${endpoint}}`);
        await Did.create(out, endpoint);
        break;
      case 'publish':
        Logger.log(`Publishing ${did}: options={out: ${out}, gateway: ${gateway}}`);
        await Did.publish(did, { out, gatewayUri: gateway });
        break;
      case 'resolve':
        Logger.log(`Resolving ${did}: options={out: ${out}, gateway: ${gateway}}`);
        await Did.resolve(did, { out, gatewayUri: gateway });
        break;
      default:
        Logger.log('Invalid action for did: must be one of create, publish or resolve');
    }
  });

// VC subcommand
program
  .command('vc')
  .description('Interact with Verifiable Credentials (VCs)')
  .option('-a, --action <create|verify>', 'action to take on the VC')
  .option('-o, --out <path>', 'optional output path for files')
  .option('-d, --data <data>', 'VC data for creation or verification')
  .action(async (options) => {
    const { action, out, data } = options;
    Logger.log('out', out);
    Logger.log('data', data);
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
  });

// DWN subcommand
program
  .command('dwn')
  .description('Interact with Decentralized Web Nodes (DWNs)')
  .option('-a, --action <create|read|update|delete>', 'action to take on the DWN')
  .option('-e, --endpoint <uri>', 'URI of the DWN resource')
  .option('-d, --data <data>', 'data for create/update actions')
  .action(async (options) => {
    const { action, endpoint, data } = options;
    Logger.log('endpoint', endpoint);
    Logger.log('data', data);
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
  });

program.parse();