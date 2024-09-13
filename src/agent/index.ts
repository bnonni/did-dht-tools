// const password = process.env.PASSWORD ?? Mnemonic.createPassword();
// const dwnEndpoints = process.env.DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'];

// const agent = await Web5UserAgent.create({ dataPath: `DATA/${dataPath}/AGENT` });
// if(await agent.firstLaunch()) {
//   const recoveryPhrase = await agent.initialize({ password, dwnEndpoints });
//   Logger.info('New recovery phrase created!', recoveryPhrase);
//   await FileSystem.write(`${newOutDir}/recovery-phrase.key`, recoveryPhrase!);
// }
// await agent.start({ password });
// const { web5 } = await Web5.connect({ agent, password, didCreateOptions: { dwnEndpoints } });
// import { Web5 } from '@web5/api';
// import { Web5UserAgent } from '@web5/user-agent';

export class Agent {

}