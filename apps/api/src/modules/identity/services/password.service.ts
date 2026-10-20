import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class PasswordService {
  generateResetToken() {
    return randomUUID();
  }
}
