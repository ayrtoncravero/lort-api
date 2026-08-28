import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CharacterService } from '../../application/services/character.service';
import { FindCharacterByIdDto } from '../dto/find-character-by-id.dto';
import { FindCharactersQueryDto } from '../dto/find-characters-query.dto';
import { CharacterResponseDto } from '../dto/character-response.dto';
import { PaginatedCharactersResponseDto } from '../dto/paginated-characters-response.dto';
import { ApiErrorResponseDto } from '../../../../common/dto/api-error-response.dto';

@ApiTags('characters')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  @ApiOkResponse({ type: PaginatedCharactersResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ApiErrorResponseDto,
  })
  findAll(
    @Query() query: FindCharactersQueryDto,
  ): Promise<PaginatedCharactersResponseDto> {
    return this.characterService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({ type: CharacterResponseDto })
  @ApiResponse({
    status: 404,
    description: 'Character not found',
    type: ApiErrorResponseDto,
  })
  findById(
    @Param() params: FindCharacterByIdDto,
  ): Promise<CharacterResponseDto> {
    return this.characterService.findById(params.id);
  }
}
