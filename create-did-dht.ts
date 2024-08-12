import { DcxAgent, DcxIdentityVault, FileSystem } from '@dcx-protocol/common';
// import { HdIdentityVault } from '@web5/agent';
// import { Web5 } from '@web5/api';

const password = 'usual sudden nurse cram bar brief noodle change';
const dataPath = 'DATA/NONNI/AGENT';
const dwnEndpoints = ['https://dwn.nonni.io/'];
const agentVault = new DcxIdentityVault();
const agent = await DcxAgent.create({ agentVault, dataPath });
const recoveryPhrase = await agent.initialize({ password, dwnEndpoints });
await agent.start({ password });
const portableDid = await agent.agentDid.export();

await FileSystem.write('nonni.recoveryPhrase.key', recoveryPhrase);
await FileSystem.write('nonni-portable.json', JSON.stringify(portableDid, null, 2));