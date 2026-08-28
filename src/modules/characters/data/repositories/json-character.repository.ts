import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Character } from '../../domain/character.entity';
import { CharacterRepository } from './character.repository';

@Injectable()
export class JsonCharacterRepository implements CharacterRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Character[]> {
    return this.jsonDataLoader.load<Character[]>('characters.json');
  }

  async findById(id: number): Promise<Character | null> {
    const characters = await this.findAll();
    return characters.find((character) => character.id === id) ?? null;
  }
}
