import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Character } from '../../domain/character.entity';
import {
  CHARACTER_REPOSITORY,
  CharacterRepository,
} from '../../data/repositories/character.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindCharactersQuery {
  page: number;
  limit: number;
  name?: string;
  race?: string;
  gender?: string;
}

@Injectable()
export class CharacterService {
  constructor(
    @Inject(CHARACTER_REPOSITORY)
    private readonly characterRepository: CharacterRepository,
  ) {}

  async findAll(
    query: FindCharactersQuery,
  ): Promise<PaginatedResult<Character>> {
    const characters = await this.characterRepository.findAll();

    const filtered = characters.filter((character) => {
      const matchesName = query.name
        ? character.name.toLowerCase().includes(query.name.toLowerCase())
        : true;
      const matchesRace = query.race
        ? character.race.toLowerCase() === query.race.toLowerCase()
        : true;
      const matchesGender = query.gender
        ? character.gender?.toLowerCase() === query.gender.toLowerCase()
        : true;
      return matchesName && matchesRace && matchesGender;
    });

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Character> {
    const character = await this.characterRepository.findById(id);
    if (!character) {
      throw new NotFoundException(`Character with id "${id}" not found`);
    }
    return character;
  }
}
