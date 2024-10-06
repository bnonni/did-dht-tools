import { mkdir, access, constants, open, readFile, rm, rmdir } from 'fs/promises';
import { Logger } from './logger.js';

type JSONStringifyOptions = {
    space?: string | number;
    replacer?: (this: any, key: string, value: any) => any;
  };

export const stringifier = (obj: any, options: JSONStringifyOptions = { space: 2 }) =>
  JSON.stringify(obj, options.replacer, options.space);

export const parse = (strObj: string) => JSON.parse(strObj);

export class Files {
  public static async mkdir(path: string, options?: { recursive: boolean }): Promise<string | undefined> {
    try {
      return await mkdir(path, options);
    } catch (error) {
      Logger.error(`Failed to mkdir ${path}`, error);
    }
  }

  public static async rm(path: string, options?: { recursive: boolean, force: boolean }): Promise<boolean> {
    try {
      options ??= { recursive: true, force: true };
      await rm(path, options);
      return true;
    } catch (error: any) {
      Logger.error(`Failed to remove ${path}`, error);
      return false;
    }
  }

  public static async rmdir(path: string, options?: { recursive: boolean, force: boolean }): Promise<boolean> {
    try {
      options ??= { recursive: true, force: true };
      await rmdir(path, options);
      return true;
    } catch (error: any) {
      Logger.error(`Failed to remove ${path}`, error);
      return false;
    }
  }

  public static async access(path: string): Promise<boolean> {
    try {
      await access(path, constants.R_OK | constants.W_OK);
      return true;
    } catch {
      Logger.error(`Cannot access ${path}`);
      return false;
    }
  }

  public static toJson(data: string): any {
    try {
      return parse(data);
    } catch (error: any) {
      Logger.error(`Failed to parse ${data} toJson`, error);
      return {};
    }
  }

  public static async exists(path: string): Promise<boolean> {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch (error: any) {
      Logger.warn(`${path} does not exist`, error);
      return false;
    }
  }

  public static async read(path: string): Promise<Buffer | undefined> {
    try {
      const exists = await Files.exists(path);
      return !exists ? undefined : await readFile(path);
    } catch (error: any) {
      Logger.warn(`Failed to read ${path}`, error);
      return undefined;
    }
  }

  public static async readToString(path: string): Promise<string> {
    try {
      const data = await Files.read(path);
      if (!data) {
        const touched = await Files.touch(path);
        Logger.info(`File ${path} touched ${touched}`);
        return '';
      }
      return data.toString();
    } catch (error: any) {
      Logger.warn(`Failed to read ${path} toString`, error);
      return '';
    }
  }

  public static async readToJson(path: string): Promise<any> {
    try {
      const data = await Files.readToString(path);
      if (!data) {
        const touched = await Files.touch(path, {});
        Logger.info(`File ${path} touched ${touched}`);
        return {};
      }
      return Files.toJson(data);
    } catch (error: any) {
      Logger.warn(`Failed to read ${path} toJson`, error);
      return {};
    }
  }

  public static async touch(path: string, data: any = ''): Promise<boolean> {
    try {
      const file = await open(path, 'w', 0o700);
      await file.writeFile(data);
      await file.close();
      return true;
    } catch (error: any) {
      Logger.warn(`Failed to touch ${path}`, error);
      return false;
    }
  }

  public static async write(path: string, data: string): Promise<boolean> {
    try {
      const file = await open(path, 'w', 0o700);
      await file.writeFile(data, 'utf-8');
      await file.close();
      return true;
    } catch (error: any) {
      Logger.error(`Failed to write ${path}`, error);
      return false;
    }
  }

  public static async append(path: string, data: string): Promise<boolean> {
    try {
      const file = await open(path, 'a', 0o700);
      await file.appendFile(data, 'utf-8');
      await file.close();
      return true;
    } catch (error: any) {
      Logger.error(`Failed to append ${path}`, error);
      return false;
    }
  }

  public static async overwrite(path: string, data: string): Promise<boolean> {
    try {
      const file = await open(path, 'w', 0o700);
      await file.writeFile(data, 'utf-8');
      await file.close();
      return true;
    } catch (error: any) {
      Logger.error(`Failed to overwrite ${path}`, error);
      return false;
    }
  }
}
