import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, NotFoundException, UseGuards, Ip, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from '../services/authentication.service';
import { RateLimitService } from '../services/rate-limit.service';
import { LoginDto, loginSchema } from '../dto/login.dto';
import { RegisterDto, registerSchema } from '../dto/register.dto';
import { RefreshDto, refreshSchema } from '../dto/refresh.dto';
import { CurrentUser, CurrentUserPayload } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly rateLimitService: RateLimitService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() body: RegisterDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    await this.rateLimitService.enforce(`register:${ip}`, {
      maxAttempts: 5,
      windowSeconds: 3600
    });

    const parsed = registerSchema.parse(body);
    return this.authenticationService.register(parsed);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: LoginDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    await this.rateLimitService.enforce(`login:${ip}`, {
      maxAttempts: 5,
      windowSeconds: 900
    });

    const parsed = loginSchema.parse(body);
    return this.authenticationService.login(parsed, {
      ipAddress: ip,
      userAgent
    });
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: RefreshDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    const parsed = refreshSchema.parse(body);
    return this.authenticationService.refresh(parsed.refreshToken, {
      ipAddress: ip,
      userAgent
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: CurrentUserPayload,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    await this.authenticationService.logout(user.sessionId, user.id, {
      ipAddress: ip,
      userAgent
    });
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async me(@CurrentUser() user: CurrentUserPayload) {
    return this.authenticationService.me(user.id);
  }

  @Get('google')
  @Public()
  async googleAuth() {
    // Check BEFORE guard runs
    const enabled = this.configService.get<string>('GOOGLE_OAUTH_ENABLED') === 'true';
    if (!enabled) {
      throw new NotFoundException('Google OAuth is not enabled');
    }
    return;
  }

  @Get('google/callback')
  @Public()
  async googleAuthRedirect(
    @Req() req: any,
    @Res() res: any,
    @Ip() ip: string,
    @Headers('user-agent') userAgent?: string
  ) {
    // Check BEFORE guard runs
    const enabled = this.configService.get<string>('GOOGLE_OAUTH_ENABLED') === 'true';
    if (!enabled) {
      throw new NotFoundException('Google OAuth is not enabled');
    }

    const user = req.user as { id?: string; email?: string; googleId?: string; firstName?: string | null; lastName?: string | null; picture?: string | null } | undefined;

    if (!user?.email || !user.googleId) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const result = await this.authenticationService.loginWithGoogle({
      googleId: user.googleId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    }, {
      ipAddress: ip,
      userAgent
    });

    const redirectUrl = new URL(process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/login');
    redirectUrl.searchParams.set('access_token', result.accessToken);
    redirectUrl.searchParams.set('refresh_token', result.refreshToken);
    redirectUrl.searchParams.set('user_email', result.user.email ?? '');
    redirectUrl.searchParams.set('provider', 'google');

    return res.redirect(redirectUrl.toString());
  }
}
