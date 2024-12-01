#!/usr/bin/env node
import { program } from 'commander';
import { Agent, Logger, stringifier, Dwn, Vc, Did } from './index.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { homedir, platform } from 'os';

const TOOL5_DIR = 'tool5';
const TOOL5_HOME = platform() === 'win32'
  ? join(process.env.APPDATA || join(homedir(), 'AppData', 'Roaming'), TOOL5_DIR)
  : join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), TOOL5_DIR);

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJsonPath = join(__dirname, '..', '..', 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')).catch(Logger.error);

// tool5
const tool5 = program.version(`tool5 ${packageJson.version}\nCLI tool5 for interacting with Web5`, '-v, --version', 'Output the current version');

// DID
const did = tool5.command('did').description('Interact with DIDs (Decentralized Identifiers)');
did.command('create')
  .description('Create a new DID')
  .option('-e, --endpoint <dwnEndpoint>', 'optional DWN endpoint for DID creation')
  .option('-g, --gateway <gatewayUri>', 'optional gateway URI for publish/resolve')
  .option('-o, --out <out>', 'optional output directory for publish/resolve actions')
  .action(async ({ endpoint, gateway, out }) => {
    endpoint ??= 'https://dwn.tbddev.org/beta';
    gateway ??= 'https://diddht.tbddev.org';
    out ??= `${TOOL5_HOME}/did/create`;
    Logger.log(`Creating new did with params ${stringifier({ endpoint, gateway, out })}`);
    await Did.create({ endpoint, gateway, out });
  });
did.command('resolve')
  .description('Resolve an existing DID')
  .option('-d, --did <did>', 'DID for publish/resolve actions')
  .option('-g, --gateway <gatewayUri>', 'optional gateway URI for publish/resolve')
  .option('-o, --out <out>', 'optional output directory for publish/resolve actions')
  .action(async ({ did, gateway, out }) => {
    gateway ??= 'https://diddht.tbddev.org';
    out ??= `${TOOL5_HOME}/did/resolve`;
    Logger.log(`Creating new did with params ${stringifier({ did, gateway, out })}`);
    await Did.resolve({ did, gateway, out });
  });
did.command('publish')
  .description('Publish a DID')
  .option('-d, --did <did>', 'DID for publish/resolve actions')
  .option('-e, --endpoint <dwnEndpoint>', 'optional DWN endpoint for DID creation')
  .option('-g, --gateway <gatewayUri>', 'optional gateway URI for publish/resolve')
  .option('-o, --out <out>', 'optional output directory for publish/resolve actions')
  .action(async ({ did, gateway, out }) => {
    gateway ??= 'https://diddht.tbddev.org';
    out ??= `${TOOL5_HOME}/did/publish`;
    Logger.log(`Creating new did with params ${stringifier({ did, gateway, out })}`);
    await Did.publish({ did, gateway, out });
  });

// VC
const vc = tool5.command('vc').description('Interact with Verifiable Credentials (VCs)');
vc.command('create')
  .description('Create a new Verifiable Credential')
  .option('-d, --data <data>', 'VC data for creation or verification')
  .action(Vc.create);
vc.command('verify')
  .description('Verify an existing VC')
  .option('-d, --data <data>', 'VC data for verification')
  .action(Vc.verify);

// DWN
const dwn = tool5.command('dwn').description('Interact with Decentralized Web Nodes (DWNs)');
const records = dwn.command('records').description('Interact with DWN records');
records.command('create')
  .description('Create new DWN record(s)')
  .option('-e, --endpoint <uri>', 'URI of the DWN resource')
  .option('-d, --data <data>', 'data for create/update actions')
  .action(Dwn.create);
records.command('read')
  .description('Read DWN records')
  .option('-e, --endpoint <uri>', 'URI of the DWN resource')
  .action(Dwn.read);
records.command('update')
  .description('Update DWN record(s)')
  .option('-d, --data <data>', 'data for create/update actions')
  .action(Dwn.update);
records.command('delete')
  .description('Delete DWN record(s)')
  .action(Dwn.delete);

// Agent
const agent = tool5.command('agent').description('Interact with Web5 Agent(s)');
agent.command('create')
  .description('Create a new Web5 Agent')
  .option('-p, --path <dataPath>', 'Agent data path')
  .action(Agent.create);


tool5.parse();