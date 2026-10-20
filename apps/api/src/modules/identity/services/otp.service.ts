import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

@Injectable()
export class OtpService {
  generateOtp(length = 6): string {
    const bytes = randomBytes(Math.ceil(length / 2));
    return bytes.toString('hex').slice(0, length).toUpperCase();
  }
}
