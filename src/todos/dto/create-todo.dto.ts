import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Buy milk', description: 'The title of the todo' })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Buy milk from the grocery store',
    description: 'The description of the todo',
  })
  description: string;
}
