#!/usr/bin/env node
import { program } from 'commander';
import packageJson from '../../package.json';
import { Agent, Logger, stringifier } from '../index.js';
import { Did } from '../primitives/did.js';
import { Dwn } from '../primitives/dwn.js';
import { Vc } from '../primitives/vc.js';

export const TOOL5_HOME = process.env.TOOL5_HOME ?? `${process.env.HOME}/.tool5`;

program.version(`${packageJson.name} ${packageJson.version}\n${packageJson.description}`, '-v, --version', 'Output the current version');

program
  .command('did')
  .description('Interact with DIDs (Decentralized Identifiers)')
  .option('-a, --action <create|publish|resolve>', 'action to take on the DID')
  .option('-e, --endpoint <dwnEndpoint>', 'optional DWN endpoint for DID creation')
  .option('-g, --gateway <gatewayUri>', 'optional gateway URI for publish/resolve')
  .option('-o, --out <out>', 'optional output directory for publish/resolve actions')
  .option('-d, --did <did>', 'DID for publish/resolve actions')
  .action(async ({ action, endpoint, gateway, out, did }) => {
    endpoint ??= 'https://dwn.tbddev.org/beta';
    gateway ??= 'https://diddht.tbddev.org';
    out ??= `${TOOL5_HOME}/did/${action}`;
    switch(action) {
      case 'create':
        Logger.log(`Creating new did with params ${stringifier({ endpoint, gateway, out })}`);
        await Did.create({ endpoint, gateway, out });
        break;
      case 'publish':
        Logger.log(`Publishing did ${did} with params ${stringifier({ did, gateway, out })}`);
        await Did.publish({ did, gateway, out });
        break;
      case 'resolve':
        Logger.log(`Resolving did ${did} with params ${stringifier({ did, gateway, out })}`);
        await Did.resolve({ did, gateway, out });
        break;
      default:
        throw new Error(`Invalid did action ${action}: must be one of create, publish or resolve`);
    }
  });

// VC subcommand
program
  .command('vc')
  .description('Interact with Verifiable Credentials (VCs)')
  .option('-a, --action <create|verify>', 'action to take on the VC')
  .option('-d, --data <data>', 'VC data for creation or verification')
  .action(async ({ action, data }) => {
    Logger.log('action', action);
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
        throw new Error(`Invalid vc action ${action}: must be one of create or verify`);
    }
  });

// DWN subcommand
program
  .command('dwn')
  .description('Interact with Decentralized Web Nodes (DWNs)')
  .option('-a, --action <create|read|update|delete>', 'action to take on the DWN')
  .option('-e, --endpoint <uri>', 'URI of the DWN resource')
  .option('-d, --data <data>', 'data for create/update actions')
  .action(async ({ action, endpoint, data }) => {
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
        throw new Error(`Invalid dwn action ${action}: must be one of create, read, update, or delete`);
    }
  });


// DWN subcommand
program
  .command('agent')
  .description('Interact with Web5 Agents')
  .option('-a, --action <create>', 'action to take on the Agent')
  .option('-p, --path <dataPath>', 'Agent data path')
  .action(async ({ action, path }) => {
    Logger.log('action', action);
    Logger.log('path', path);
    switch(action) {
      case 'create':
        Logger.log('Creating a web5 agent');
        await Agent.create();
        break;
      default:
        throw new Error(`Invalid agent action ${action}: must be create`);
    }
  });


program.parse();