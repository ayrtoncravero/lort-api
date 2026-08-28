import { Module } from '@nestjs/common';
import { CharacterController } from './presentation/controllers/character.controller';
import { CharacterService } from './application/services/character.service';
import { CHARACTER_REPOSITORY } from './data/repositories/character.repository';
import { JsonCharacterRepository } from './data/repositories/json-character.repository';

@Module({
  controllers: [CharacterController],
  providers: [
    CharacterService,
    { provide: CHARACTER_REPOSITORY, useClass: JsonCharacterRepository },
  ],
  exports: [CHARACTER_REPOSITORY],
})
export class CharactersModule {}
