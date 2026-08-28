import { NotFoundException } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterRepository } from '../../data/repositories/character.repository';
import { Character } from '../../domain/character.entity';

describe('CharacterService', () => {
  let service: CharacterService;
  let repository: jest.Mocked<CharacterRepository>;

  const character: Character = {
    id: 1,
    name: 'Frodo Baggins',
    race: 'Hobbit',
    gender: 'Male',
    birth: null,
    death: null,
    hair: null,
    height: null,
    realm: null,
    spouse: null,
    wikiUrl: null,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new CharacterService(repository);
  });

  it('returns paginated characters from the repository', async () => {
    repository.findAll.mockResolvedValue([character]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [character],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('filters characters by race', async () => {
    repository.findAll.mockResolvedValue([character]);

    await expect(
      service.findAll({ page: 1, limit: 20, race: 'Elf' }),
    ).resolves.toEqual({ data: [], page: 1, limit: 20, total: 0 });
  });

  it('returns a character by id', async () => {
    repository.findById.mockResolvedValue(character);

    await expect(service.findById(1)).resolves.toEqual(character);
  });

  it('throws NotFoundException when the character does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
