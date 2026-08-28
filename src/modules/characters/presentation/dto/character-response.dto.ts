import { ApiProperty } from '@nestjs/swagger';

export class CharacterResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  race!: string;

  @ApiProperty({ nullable: true, type: String })
  gender!: string | null;

  @ApiProperty({ nullable: true, type: String })
  birth!: string | null;

  @ApiProperty({ nullable: true, type: String })
  death!: string | null;

  @ApiProperty({ nullable: true, type: String })
  hair!: string | null;

  @ApiProperty({ nullable: true, type: String })
  height!: string | null;

  @ApiProperty({ nullable: true, type: String })
  realm!: string | null;

  @ApiProperty({ nullable: true, type: String })
  spouse!: string | null;

  @ApiProperty({ nullable: true, type: String })
  wikiUrl!: string | null;
}
