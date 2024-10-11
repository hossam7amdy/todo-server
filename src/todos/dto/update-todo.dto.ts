import { CreateTodoDto } from './create-todo.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTodoDto extends CreateTodoDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'Whether the todo item is done or not',
  })
  done: boolean;
}
