import { FileSystem, Logger, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import { Web5UserAgent } from '@web5/user-agent';
import crypto from 'crypto';
import { mkdir } from 'fs/promises';

export class Did {

  public static async create() {
    const password = process.env.PASSWORD ?? Mnemonic.createPassword();
    const dwnEndpoints = process.env.DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'];

    const dataPath = crypto.randomUUID().toUpperCase();
    const newOutDir = `out/${dataPath}`;
    await mkdir(newOutDir, {recursive: true});

    const agent = await Web5UserAgent.create({ dataPath: `DATA/${dataPath}/AGENT` });
    if(await agent.firstLaunch()) {
      const recoveryPhrase = await agent.initialize({ password });
      Logger.info('New recovery phrase created!', recoveryPhrase);
      await FileSystem.write(`${newOutDir}/recovery-phrase.key`, recoveryPhrase!);
    }
    await agent.start({ password });
    const { web5 } = await Web5.connect({ agent, password, didCreateOptions: { dwnEndpoints } });

    Logger.info('New did created!');
    await FileSystem.write(`${newOutDir}/did.json`, JSON.stringify(web5.agent.agentDid.document, null, 2));

    const portableDid = await web5.agent.agentDid.export();
    Logger.info('New portable did exported!');
    await FileSystem.write(`${newOutDir}/portable-did.json`, JSON.stringify(portableDid, null, 2));

    Logger.info(`New did created and exported to directory ${newOutDir}!`);
    Logger.info('Keep your recovery phrase and portable DID private and safe!');
    Logger.info('Host your did.json in public location (e.g. yourdomain.com/.well-known/did.json) to share your DID with others.');
  }

  public static async publish() {
    throw new Error('Not implemented');
  }
}