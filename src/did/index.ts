import { DcxAgent, FileSystem, Logger, Mnemonic } from '@dcx-protocol/common';
import { Web5 } from '@web5/api';
import crypto from 'crypto';
import { mkdir } from 'fs/promises';
import path from 'path';

interface DidData {
  password: string;
  dwnEndpoints: string[];
  recoveryPhrase?: string;
}
export class Did {
  private static agent: DcxAgent;
  private static web5: Web5;
  private static data: DidData = {
    password       : process.env.PASSWORD ?? Mnemonic.createPassword(),
    dwnEndpoints   : process.env.DWN_ENDPOINTS?.split(',') ?? ['https://dwn.tbddev.org/beta'],
  };
  private static newOutDirName: string = crypto.randomUUID().toUpperCase();
  private static dataPath: string = `DATA/${Did.newOutDirName}/AGENT`;
  private static newOutDir: string = path.resolve(`out/${Did.newOutDirName}`);

  private static async createAgent() {
    Did.agent = await DcxAgent.create({ dataPath: Did.dataPath });
  }

  private static async createWeb5() {
    const { web5 } = await Web5.connect({
      agent            : Did.agent,
      password         : Did.data.password,
      didCreateOptions : { dwnEndpoints: Did.data.dwnEndpoints },
    });
    Did.web5 = web5;
  }

  private static async startAgent({ recover }: { recover: boolean } = { recover: false}) {
    const password = Did.data.password;
    const dwnEndpoints = Did.data.dwnEndpoints;
    const recoveryPhrase = Did.data.recoveryPhrase;

    if(recover && !recoveryPhrase) {
      throw new Error('Recovery phrase is required for recovery');
    }

    if(await Did.agent.firstLaunch()) {
      Did.data.recoveryPhrase = await Did.agent.initialize({ password, dwnEndpoints, recoveryPhrase });
    }
    await Did.agent.start({ password });
  }

  private static async saveSecrets() {
    await FileSystem.write(`${Did.newOutDir}/password.key`, Did.data.password);
    Logger.security('Password saved!');

    const portableDid = await Did.web5.agent.agentDid.export();
    await FileSystem.write(`${Did.newOutDir}/portable-did.json`, JSON.stringify(portableDid, null, 2));
    Logger.security('Portable did saved!');

    if(Did.data.recoveryPhrase) {
      await FileSystem.write(`${Did.newOutDir}/recovery-phrase.key`, Did.data.recoveryPhrase);
      Logger.security('Recorvery phrase saved!');
    }
  }

  public static async saveDidDocument() {
    await FileSystem.write(`${Did.newOutDir}/did.json`, JSON.stringify(Did.web5.agent.agentDid.document, null, 2));
    Logger.debug('Did document saved!');
  }

  public static async create({ dwnEndpoints, password }: { dwnEndpoints?: string[], password?: string }) {
    dwnEndpoints ??= ['https://dwn.tbddev.org/beta'];
    Did.data.dwnEndpoints = dwnEndpoints;

    password ??= Mnemonic.createPassword();
    Did.data.password = password;

    Did.dataPath ??= crypto.randomUUID().toUpperCase();
    Did.newOutDir ??= path.resolve(`out/${Did.dataPath}`);

    await mkdir(Did.newOutDir, { recursive: true });

    await Did.createAgent();
    await Did.startAgent();
    await Did.createWeb5();
    await Did.saveSecrets();
    await Did.saveDidDocument();

    Logger.debug(
      'Create success! ' +
      `All data saved to ${Did.newOutDir}`
    );
    Logger.security(
      'Keep password.key, recoveryPhrase.key and portable-did.json private and safe!'
    );
    Logger.debug(
      'Share your did.json with the world! ' +
      'W3C Standard location: .well-known/did.json in your domain root.'
    );
  }

  public static async recover({ password, recoveryPhrase }: { password: string, recoveryPhrase: string }) {
    if(!recoveryPhrase || !password) {
      throw new Error('Both password and recoveryPhrase are required for recovery');
    }

    Did.data.recoveryPhrase = recoveryPhrase;
    Did.data.password = password;
    Did.dataPath ??= crypto.randomUUID().toUpperCase();

    await mkdir(Did.newOutDir, { recursive: true });

    await Did.createAgent();
    await Did.startAgent({ recover: true });
    await Did.createWeb5();

    Logger.debug('Recover success!');
    Logger.debug(`Recovered did document saved to ${Did.newOutDir}`);
  }

  public static async publish() {
    throw new Error('Not implemented');
  }
}