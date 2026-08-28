import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Ainur } from '../../domain/ainur.entity';
import {
  AINUR_REPOSITORY,
  AinurRepository,
} from '../../data/repositories/ainur.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindAinurQuery {
  page: number;
  limit: number;
  name?: string;
  type?: string;
  characterId?: number;
}

@Injectable()
export class AinurService {
  constructor(
    @Inject(AINUR_REPOSITORY)
    private readonly ainurRepository: AinurRepository,
  ) {}

  async findAll(query: FindAinurQuery): Promise<PaginatedResult<Ainur>> {
    const ainur = await this.ainurRepository.findAll();

    const filtered = ainur.filter((entity) => {
      const matchesName = query.name
        ? entity.name.toLowerCase().includes(query.name.toLowerCase())
        : true;
      const matchesType = query.type
        ? entity.type.toLowerCase() === query.type.toLowerCase()
        : true;
      const matchesCharacterId =
        query.characterId !== undefined
          ? entity.characterId === query.characterId
          : true;
      return matchesName && matchesType && matchesCharacterId;
    });

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Ainur> {
    const entity = await this.ainurRepository.findById(id);
    if (!entity) {
      throw new NotFoundException(`Ainur with id "${id}" not found`);
    }
    return entity;
  }
}
