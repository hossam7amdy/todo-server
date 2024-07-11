import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  userId: string;
}
