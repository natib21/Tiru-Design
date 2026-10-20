import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Controller('auth')
export class PasswordController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: { email: string }) {
    return this.authenticationService.forgotPassword(body);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authenticationService.resetPassword(body);
  }

  @Post('change-password')
  @UseGuards()
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: { user?: { id?: string } }, @Body() body: { currentPassword: string; newPassword: string }) {
    return this.authenticationService.changePassword(req.user?.id, body);
  }
}
