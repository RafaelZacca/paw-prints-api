import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async googleLogin(googleUser: any): Promise<{ access_token: string }> {
    const { email, sub, name, picture } = googleUser;

    const userName = name ?? email.split('@')[0];

    const user = await this.usersService.create({
      email,
      sub,
      name: userName,
      image: picture,
    });

    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    return { access_token: token };
  }
}
