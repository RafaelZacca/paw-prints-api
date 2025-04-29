import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Passport will handle redirection automatically
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { access_token } = await this.authService.googleLogin(req.user);

    const platform = process.env.PLATFORM || 'web'; // Default to 'web' if not set

    if (platform === 'mobile') {
      const mobileRedirectUrl = `${process.env.MOBILE_REDIRECT_URL}://callback?token=${access_token}`;

      return res.redirect(mobileRedirectUrl);
    } else {
      const webRedirectUrl = `${process.env.WEB_REDIRECT_URL}/auth/callback?token=${access_token}`;
      return res.redirect(webRedirectUrl);
    }
  }
}
