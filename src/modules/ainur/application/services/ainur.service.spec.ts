import { NotFoundException } from '@nestjs/common';
import { AinurService } from './ainur.service';
import { AinurRepository } from '../../data/repositories/ainur.repository';
import { Ainur } from '../../domain/ainur.entity';

describe('AinurService', () => {
  let service: AinurService;
  let repository: jest.Mocked<AinurRepository>;

  const eru: Ainur = {
    id: 1,
    name: 'Eru Iluvatar',
    type: 'creator',
    characterId: null,
    wikiUrl: null,
  };

  const gandalf: Ainur = {
    id: 12,
    name: 'Gandalf',
    type: 'Maia',
    characterId: 2,
    wikiUrl: null,
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
    service = new AinurService(repository);
  });

  it('returns paginated ainur from the repository', async () => {
    repository.findAll.mockResolvedValue([eru]);

    await expect(service.findAll({ page: 1, limit: 20 })).resolves.toEqual({
      data: [eru],
      page: 1,
      limit: 20,
      total: 1,
    });
  });

  it('paginates results', async () => {
    repository.findAll.mockResolvedValue([eru, gandalf]);

    await expect(service.findAll({ page: 1, limit: 1 })).resolves.toEqual({
      data: [eru],
      page: 1,
      limit: 1,
      total: 2,
    });
  });

  it('filters by name (substring, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([eru, gandalf]);

    await expect(
      service.findAll({ page: 1, limit: 20, name: 'gandalf' }),
    ).resolves.toEqual({ data: [gandalf], page: 1, limit: 20, total: 1 });
  });

  it('filters by type (exact match, case-insensitive)', async () => {
    repository.findAll.mockResolvedValue([eru, gandalf]);

    await expect(
      service.findAll({ page: 1, limit: 20, type: 'maia' }),
    ).resolves.toEqual({ data: [gandalf], page: 1, limit: 20, total: 1 });
  });

  it('returns an ainur by id', async () => {
    repository.findById.mockResolvedValue(gandalf);

    await expect(service.findById(gandalf.id)).resolves.toEqual(gandalf);
  });

  it('throws NotFoundException when the ainur does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findById(999999)).rejects.toThrow(NotFoundException);
  });
});
