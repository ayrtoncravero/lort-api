import { Character } from '../../domain/character.entity';

export interface CharacterRepository {
  findAll(): Promise<Character[]>;
  findById(id: number): Promise<Character | null>;
}

export const CHARACTER_REPOSITORY = Symbol('CHARACTER_REPOSITORY');
