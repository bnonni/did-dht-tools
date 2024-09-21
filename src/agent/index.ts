// import { Logger, Mnemonic, FileSystem } from '@dcx-protocol/common';
// import { Web5 } from '@web5/api';
// import { Web5UserAgent } from '@web5/user-agent';
// import {Web5PlatformAgent} from '@web5/agent';
// export class Agent {
//   public static async create(dataPath: string): Promise<Web5UserAgent> {
//     dataPath ??= 'AGENT';
//     return await Web5UserAgent.create({ dataPath: `DATA/${dataPath}` });
//   }

//   public static async initialize(agent: Web5UserAgent, out: string): Promise<Web5UserAgent> {
//     out ??= `out/agent/${crypto.randomUUID().toUpperCase()}`;
//     const password = Mnemonic.createPassword();
//     const dwnEndpoints = ['https://dwn.tbddev.org/beta'];
//     const recoveryPhrase = await agent.initialize({ password, dwnEndpoints });
//     Logger.info('New recovery phrase created!', recoveryPhrase);
//     await FileSystem.write(`${out}/recovery-phrase.key`, recoveryPhrase!);
//     return agent;
//   }

//   public static async start(agent: Web5UserAgent, password: string): Promise<Web5UserAgent> {
//     await agent.start({ password });
//     return agent;
//   }

//   public static async connect(agent: Web5UserAgent, password: string): Promise<void> {
//     agent = agent as any;
//     const { web5, did } = await Web5.connect({ agent, password });

//   }
// }