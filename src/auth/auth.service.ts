import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import configuration, { Configuration } from 'src/config/configuration';

@Injectable()
export class AuthService {
  private readonly jwt: Configuration['auth']['jwt'];
  private readonly clientUrl = configuration().clientUrl;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {
    this.jwt = configuration().auth.jwt;
  }

  async validateUser(email: string): Promise<User | null> {
    return this.userService.findOneByEmail(email);
  }

  async googleLogin(user: any): Promise<{ accessToken: string }> {
    let existingUser = await this.userService.findOneByEmail(user.email);
    if (!existingUser) {
      existingUser = await this.userService.create(user);
    }

    const payload = { email: existingUser.email, sub: existingUser._id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.jwt.secret,
      }),
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.findOneByEmail(email);
    if (
      !user ||
      !user.password ||
      !(await bcrypt.compare(password, user.password))
    ) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!user.isEmailVerified) {
      throw new BadRequestException('Email not verified');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.jwt.secret,
      }),
    };
  }

  async logout(userId: string): Promise<User> {
    return this.userService.update(userId, { accessToken: null });
  }

  async register(registerDto: RegisterDto): Promise<{ message: string }> {
    const { email, password, firstName, lastName } = registerDto;
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const verificationToken = this.jwtService.sign(
      { email: newUser.email },
      { secret: this.jwt.verifySecret, expiresIn: '24h' },
    );

    const verificationUrl = `${this.clientUrl}/api/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendVerificationEmail(
      newUser.email,
      newUser.firstName,
      verificationUrl,
    );

    return { message: 'User registered. Please check your email to verify.' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const verificationToken = this.jwtService.sign(
      { email: user.email },
      { secret: this.jwt.verifySecret, expiresIn: '24h' },
    );

    const verificationUrl = `${this.clientUrl}/api/auth/verify-email?token=${verificationToken}`;

    await this.mailerService.sendVerificationEmail(
      user.email,
      user.firstName,
      verificationUrl,
    );

    return { message: 'Verification email sent.' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const resetToken = this.jwtService.sign(
      { email: user.email },
      { secret: this.jwt.resetSecret, expiresIn: '1h' },
    );

    const resetUrl = `${this.clientUrl}/reset-password?token=${resetToken}`;

    await this.mailerService.sendPasswordResetEmail(
      user.email,
      user.firstName,
      resetUrl,
    );

    return { message: 'Password reset email sent.' };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.jwt.resetSecret,
      });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const user = await this.userService.findOneByEmail(payload.email);

      await this.userService.update(user.id, {
        password: hashedPassword,
      });
      return { message: 'Password reset successful' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token.');
    }
  }

  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.jwt.verifySecret,
      });

      const user = await this.userService.findOneByEmail(payload.email);

      await this.userService.update(user.id, { isEmailVerified: true });
      return { message: 'Email verified successfully.' };
    } catch (error) {
      throw new BadRequestException('Invalid token or token expired.');
    }
  }
}
