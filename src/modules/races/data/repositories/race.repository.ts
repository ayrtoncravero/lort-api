import { Race } from '../../domain/race.entity';

export interface RaceRepository {
  findAll(): Promise<Race[]>;
  findById(id: number): Promise<Race | null>;
}

export const RACE_REPOSITORY = Symbol('RACE_REPOSITORY');
