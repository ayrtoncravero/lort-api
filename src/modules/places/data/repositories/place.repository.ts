import { Place } from '../../domain/place.entity';

export interface PlaceRepository {
  findAll(): Promise<Place[]>;
  findById(id: number): Promise<Place | null>;
}

export const PLACE_REPOSITORY = Symbol('PLACE_REPOSITORY');
