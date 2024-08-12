import { FileSystem, Logger, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';

const password = process.env.PASSWORD ?? Mnemonic.createPassword();
const dwnEndpoints = process.env.DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'];

const { web5, recoveryPhrase } = await Web5.connect({ password, didCreateOptions: { dwnEndpoints } });

await FileSystem.write('did.json', JSON.stringify(web5.agent.agentDid.document, null, 2));

if(recoveryPhrase) {
  Logger.info('New recovery phrase created!', recoveryPhrase);
  await FileSystem.write('recovery-phrase.key', recoveryPhrase!);
}

const portableDid = await web5.agent.agentDid.export();
await FileSystem.write('portable-did.json', JSON.stringify(portableDid, null, 2));

Logger.info('Keep your recovery phrase and portable DID private and safe!');
Logger.info('Publish your did.json to a public location to share your DID with others.');

/*
import { DcxAgent, DcxIdentityVault, FileSystem } from '@dcx-protocol/common';
const password = '';
const dataPath = 'DATA/AGENT';
const dwnEndpoints = ['https://dwn.tbddev.org/beta'];
const agentVault = new DcxIdentityVault();
const agent = await DcxAgent.create({ agentVault, dataPath });
const recoveryPhrase = await agent.initialize({ password, dwnEndpoints });
await agent.start({ password });
const portableDid = await agent.agentDid.export();
await FileSystem.write('secrets/recovery-phrase.key', recoveryPhrase);
await FileSystem.write('secrets/portable-did.json', JSON.stringify(portableDid, null, 2));
*/