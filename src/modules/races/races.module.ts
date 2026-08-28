import { Module } from '@nestjs/common';
import { RaceController } from './presentation/controllers/race.controller';
import { RaceService } from './application/services/race.service';
import { RACE_REPOSITORY } from './data/repositories/race.repository';
import { JsonRaceRepository } from './data/repositories/json-race.repository';

@Module({
  controllers: [RaceController],
  providers: [
    RaceService,
    { provide: RACE_REPOSITORY, useClass: JsonRaceRepository },
  ],
  exports: [RACE_REPOSITORY],
})
export class RacesModule {}
