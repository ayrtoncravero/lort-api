import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Place } from '../../domain/place.entity';
import {
  PLACE_REPOSITORY,
  PlaceRepository,
} from '../../data/repositories/place.repository';
import { PaginatedResult } from '../../../../common/types/paginated-result.interface';
import { paginate } from '../../../../common/utils/paginate';

export interface FindPlacesQuery {
  page: number;
  limit: number;
  name?: string;
  type?: string;
}

@Injectable()
export class PlaceService {
  constructor(
    @Inject(PLACE_REPOSITORY)
    private readonly placeRepository: PlaceRepository,
  ) {}

  async findAll(query: FindPlacesQuery): Promise<PaginatedResult<Place>> {
    const places = await this.placeRepository.findAll();

    const filtered = places.filter((place) => {
      const matchesName = query.name
        ? place.name.toLowerCase().includes(query.name.toLowerCase())
        : true;
      const matchesType = query.type
        ? place.type.toLowerCase() === query.type.toLowerCase()
        : true;
      return matchesName && matchesType;
    });

    return paginate(filtered, query.page, query.limit);
  }

  async findById(id: number): Promise<Place> {
    const place = await this.placeRepository.findById(id);
    if (!place) {
      throw new NotFoundException(`Place with id "${id}" not found`);
    }
    return place;
  }
}
