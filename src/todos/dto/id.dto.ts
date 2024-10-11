import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class IdDto {
  @IsMongoId()
  @ApiProperty({
    example: '60f9e7b6c9e4a6001c8f3d1f',
    description: 'The ID of the todo item',
  })
  id: string;
}
