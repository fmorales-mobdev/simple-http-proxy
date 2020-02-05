import { FileDataSource } from './file.datasource';
import { promises } from 'fs';

export class JsonFileDataSource implements FileDataSource {
  constructor(private file: string) {}

  getEntities<T>(): Promise<T[]> {
    return this.readFileAndParseBuffer<T>(this.parseJsonArrayBuffer);
  }

  getEntity<T>(): Promise<T> {
    return this.readFileAndParseBuffer(this.parseJsonObjectBuffer);
  }

  private readFileAndParseBuffer<T>(parseMethod: Function) {
    return promises
      .readFile(this.file)
      .then(buffer => parseMethod(buffer))
      .catch(error => {
        throw error;
      });
  }

  private parseJsonArrayBuffer(buffer: Buffer) {
    const json = JSON.parse(buffer.toString('utf8'));
    if (!(json instanceof Array)) {
      throw new Error('JSON File should contain an Array of Objects');
    }
    return json;
  }

  private parseJsonObjectBuffer(buffer: Buffer) {
    const json = JSON.parse(buffer.toString('utf8'));
    if (json instanceof Array) {
      throw new Error('JSON File should contain an Object');
    }
    return json;
  }
}
