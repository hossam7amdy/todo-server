import { IsString, IsStrongPassword, IsJWT } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-string' })
  @IsString()
  @IsJWT()
  token: string;

  @ApiProperty({ example: 'newPass123#' })
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 'newPass123' })
  @IsString()
  confirmPassword: string;

  validate() {
    return this.password === this.confirmPassword;
  }
}
