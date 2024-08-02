import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleAuth(@Req() req: Request) {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.googleLogin(req.user);

    res.cookie('jwt', accessToken, { httpOnly: true });

    const redirectUrl: string =
      req.headers.origin || req.headers.referer || process.env.FRONTEND_URL;

    return res.redirect(`${redirectUrl}?success=true&token=${accessToken}`);
  }
}
