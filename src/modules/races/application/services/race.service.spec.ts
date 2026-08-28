import { NotFoundException } from '@nestjs/common';
import { RaceService } from './race.service';
import { RaceRepository } from '../../data/repositories/race.repository';
import { Race } from '../../domain/race.entity';

describe('RaceService', () => {
  let service: RaceService;
  let repository: jest.Mocked<RaceRepository>;

  const elves: Race = {
    id: 2,
    name: 'Elves',
    type: 'major-race',
    parentId: null,
    wikiUrl: null,
  };

  const noldor: Race = {
    id: 7,
    name: 'Noldor',
    type: 'subgroup',
    parentId: 2,
    wikiUrl: null,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new RaceService(repository);
  });

  it('returns paginated races from the repository', async () => {
    repository.findAll.mockResolvedValue([elves]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [elves],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('paginates results', async () => {
    repository.findAll.mockResolvedValue([elves, noldor]);

    await expect(service.findAll({ page: 1, limit: 1 })).resolves.toEqual({
      data: [elves],
      page: 1,
      limit: 1,
      total: 2,
    });
  });

  it('filters races by name (substring, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([elves, noldor]);

    await expect(
      service.findAll({ page: 1, limit: 20, name: 'noldor' }),
    ).resolves.toEqual({ data: [noldor], page: 1, limit: 20, total: 1 });
  });

  it('filters races by type (exact match, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([elves, noldor]);

    await expect(
      service.findAll({ page: 1, limit: 20, type: 'Major-Race' }),
    ).resolves.toEqual({ data: [elves], page: 1, limit: 20, total: 1 });
  });

  it('returns a race by id', async () => {
    repository.findById.mockResolvedValue(noldor);

    await expect(service.findById(noldor.id)).resolves.toEqual(noldor);
  });

  it('throws NotFoundException when the race does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
