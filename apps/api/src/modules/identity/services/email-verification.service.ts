import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class EmailVerificationService {
  generateToken() {
    return randomUUID();
  }
}
