import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiExcludeEndpoint,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RequestResetDto } from './dto/request-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import configuration from 'src/config/configuration';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly clientUrl = configuration().clientUrl;

  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req: Request) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(req.user);

    res.cookie('jwt', accessToken, { httpOnly: true });

    const redirectUrl: string =
      req.headers.origin || req.headers.referer || this.clientUrl;

    return res.redirect(`${redirectUrl}?success=true&token=${accessToken}`);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res() res: Response,
    @Req() req: Request & { user: { userId: string } },
  ) {
    res.clearCookie('jwt', { httpOnly: true });

    const redirectUrl: string =
      req.headers.origin || req.headers.referer || this.clientUrl;

    return res.redirect(`${redirectUrl}?success=true`);
  }

  @Get('verify-email')
  @ApiQuery({ name: 'token', required: true })
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('resend-verification-email')
  @ApiBody({ type: RequestResetDto })
  async resendVerificationEmail(@Body() body: RequestResetDto) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('request-reset')
  @ApiBody({ type: RequestResetDto })
  async requestPasswordReset(@Body() body: RequestResetDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.password);
  }
}
