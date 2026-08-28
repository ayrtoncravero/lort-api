import { Module } from '@nestjs/common';
import { AinurController } from './presentation/controllers/ainur.controller';
import { AinurService } from './application/services/ainur.service';
import { AINUR_REPOSITORY } from './data/repositories/ainur.repository';
import { JsonAinurRepository } from './data/repositories/json-ainur.repository';

@Module({
  controllers: [AinurController],
  providers: [
    AinurService,
    { provide: AINUR_REPOSITORY, useClass: JsonAinurRepository },
  ],
  exports: [AINUR_REPOSITORY],
})
export class AinurModule {}
