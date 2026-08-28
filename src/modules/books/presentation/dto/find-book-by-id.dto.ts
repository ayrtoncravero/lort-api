import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class FindBookByIdDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;
}
