import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class JsonDataLoader {
  private readonly logger = new Logger(JsonDataLoader.name);
  private readonly dataDir = join(process.cwd(), 'data');

  async load<T>(fileName: string): Promise<T> {
    const filePath = join(this.dataDir, fileName);

    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf-8');
    } catch {
      this.logger.error(`Data file not found: ${filePath}`);
      throw new InternalServerErrorException(
        `Data source "${fileName}" is unavailable`,
      );
    }

    try {
      return JSON.parse(raw) as T;
    } catch {
      this.logger.error(`Invalid JSON in data file: ${filePath}`);
      throw new InternalServerErrorException(
        `Data source "${fileName}" is corrupted`,
      );
    }
  }
}
