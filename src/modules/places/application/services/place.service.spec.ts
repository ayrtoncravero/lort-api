import { NotFoundException } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceRepository } from '../../data/repositories/place.repository';
import { Place } from '../../domain/place.entity';

describe('PlaceService', () => {
  let service: PlaceService;
  let repository: jest.Mocked<PlaceRepository>;

  const gondor: Place = {
    id: 2,
    name: 'Gondor',
    type: 'realm',
    parentId: null,
    wikiUrl: null,
  };

  const minasTirith: Place = {
    id: 17,
    name: 'Minas Tirith',
    type: 'settlement',
    parentId: 2,
    wikiUrl: null,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new PlaceService(repository);
  });

  it('returns paginated places from the repository', async () => {
    repository.findAll.mockResolvedValue([gondor]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [gondor],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('paginates results', async () => {
    repository.findAll.mockResolvedValue([gondor, minasTirith]);

    await expect(service.findAll({ page: 1, limit: 1 })).resolves.toEqual({
      data: [gondor],
      page: 1,
      limit: 1,
      total: 2,
    });
  });

  it('filters places by name (substring, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([gondor, minasTirith]);

    await expect(
      service.findAll({ page: 1, limit: 20, name: 'gondor' }),
    ).resolves.toEqual({ data: [gondor], page: 1, limit: 20, total: 1 });
  });

  it('filters places by type (exact match, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([gondor, minasTirith]);

    await expect(
      service.findAll({ page: 1, limit: 20, type: 'Realm' }),
    ).resolves.toEqual({ data: [gondor], page: 1, limit: 20, total: 1 });
  });

  it('returns a place by id', async () => {
    repository.findById.mockResolvedValue(minasTirith);

    await expect(service.findById(minasTirith.id)).resolves.toEqual(
      minasTirith,
    );
  });

  it('throws NotFoundException when the place does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
