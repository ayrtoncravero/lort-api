import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Race } from '../../domain/race.entity';
import { RaceRepository } from './race.repository';

@Injectable()
export class JsonRaceRepository implements RaceRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Race[]> {
    return this.jsonDataLoader.load<Race[]>('races.json');
  }

  async findById(id: number): Promise<Race | null> {
    const races = await this.findAll();
    return races.find((race) => race.id === id) ?? null;
  }
}
