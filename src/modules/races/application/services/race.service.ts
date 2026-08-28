import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Race } from '../../domain/race.entity';
import {
  RACE_REPOSITORY,
  RaceRepository,
} from '../../data/repositories/race.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindRacesQuery {
  page: number;
  limit: number;
  name?: string;
  type?: string;
}

@Injectable()
export class RaceService {
  constructor(
    @Inject(RACE_REPOSITORY)
    private readonly raceRepository: RaceRepository,
  ) {}

  async findAll(query: FindRacesQuery): Promise<PaginatedResult<Race>> {
    const races = await this.raceRepository.findAll();

    const filtered = races.filter((race) => {
      const matchesName = query.name
        ? race.name.toLowerCase().includes(query.name.toLowerCase())
        : true;
      const matchesType = query.type
        ? race.type.toLowerCase() === query.type.toLowerCase()
        : true;
      return matchesName && matchesType;
    });

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Race> {
    const race = await this.raceRepository.findById(id);
    if (!race) {
      throw new NotFoundException(`Race with id "${id}" not found`);
    }
    return race;
  }
}
