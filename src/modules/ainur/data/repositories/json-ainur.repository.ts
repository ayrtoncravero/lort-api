import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Ainur } from '../../domain/ainur.entity';
import { AinurRepository } from './ainur.repository';

@Injectable()
export class JsonAinurRepository implements AinurRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Ainur[]> {
    return this.jsonDataLoader.load<Ainur[]>('ainur.json');
  }

  async findById(id: number): Promise<Ainur | null> {
    const ainur = await this.findAll();
    return ainur.find((entity) => entity.id === id) ?? null;
  }
}
