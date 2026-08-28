import { Injectable } from '@nestjs/common';
import { JsonDataLoader } from '../../../../infrastructure/json/json-data-loader';
import { Place } from '../../domain/place.entity';
import { PlaceRepository } from './place.repository';

@Injectable()
export class JsonPlaceRepository implements PlaceRepository {
  constructor(private readonly jsonDataLoader: JsonDataLoader) {}

  async findAll(): Promise<Place[]> {
    return this.jsonDataLoader.load<Place[]>('places.json');
  }

  async findById(id: number): Promise<Place | null> {
    const places = await this.findAll();
    return places.find((place) => place.id === id) ?? null;
  }
}
