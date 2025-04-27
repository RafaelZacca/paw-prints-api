import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service'; // Import UsersService

@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService, // Inject UsersService
  ) {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      throw new Error('Missing GOOGLE_CLIENT_ID environment variable');
    }
    this.client = new OAuth2Client(googleClientId);
  }

  async validateOAuthLogin(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      throw new Error('Missing email or sub in payload');
    }

    const { email, sub, name, picture } = payload;

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
