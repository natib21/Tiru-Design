import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';

@Controller('auth')
export class VerificationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('verify-phone')
  @HttpCode(HttpStatus.OK)
  async verifyPhone(@Body() body: { phoneNumber: string; otp: string }) {
    return this.authenticationService.verifyPhone(body);
  }

  @Post('resend-phone-otp')
  @HttpCode(HttpStatus.OK)
  async resendPhoneOtp(@Body() body: { phoneNumber: string }) {
    return this.authenticationService.resendPhoneOtp(body);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() body: { token: string }) {
    return this.authenticationService.verifyEmail(body);
  }

  @Post('resend-email-verification')
  @HttpCode(HttpStatus.OK)
  async resendEmailVerification(@Body() body: { email: string }) {
    return this.authenticationService.resendEmailVerification(body);
  }
}
