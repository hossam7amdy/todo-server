import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string): Promise<User | null> {
    return this.userService.findOneByEmail(email);
  }

  async googleLogin(user: any): Promise<any> {
    let existingUser = await this.userService.findOneByEmail(user.email);
    if (!existingUser) {
      existingUser = await this.userService.create(user);
    }

    const payload = { email: existingUser.email, sub: existingUser._id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
