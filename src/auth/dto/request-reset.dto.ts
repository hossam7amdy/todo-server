import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
