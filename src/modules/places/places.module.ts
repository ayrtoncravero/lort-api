import { Module } from '@nestjs/common';
import { PlaceController } from './presentation/controllers/place.controller';
import { PlaceService } from './application/services/place.service';
import { PLACE_REPOSITORY } from './data/repositories/place.repository';
import { JsonPlaceRepository } from './data/repositories/json-place.repository';

@Module({
  controllers: [PlaceController],
  providers: [
    PlaceService,
    { provide: PLACE_REPOSITORY, useClass: JsonPlaceRepository },
  ],
  exports: [PLACE_REPOSITORY],
})
export class PlacesModule {}
