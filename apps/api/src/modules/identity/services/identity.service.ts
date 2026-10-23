import { Injectable } from '@nestjs/common';
import * as argon2 from '@node-rs/argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class IdentityService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  normalizePhone(phone: string) {
    const value = phone.trim();
    return value.startsWith('+') ? value : `+${value.replace(/\s+/g, '')}`;
  }

  async hashPassword(password: string) {
    const options = process.env.NODE_ENV === 'test'
      ? { memoryCost: 2048, timeCost: 2, parallelism: 1 } // Fast for tests
      : {}; // Use argon2 defaults (strong) for production
    
    return argon2.hash(password, options);
  }

  async verifyPassword(password: string, hash: string) {
    return argon2.verify(hash, password);
  }

  async createUser(data: { email: string; phoneNumber?: string | null; passwordHash: string }) {
    const prisma = this.prisma.client;
    if (!prisma) {
      throw new Error('Database client not available');
    }

    return prisma.user.create({
      data: {
        email: this.normalizeEmail(data.email),
        phoneNumber: data.phoneNumber ? this.normalizePhone(data.phoneNumber) : null,
        passwordHash: data.passwordHash,
        status: 'UNVERIFIED'
      }
    });
  }

  async findUserByEmail(email: string) {
    const prisma = this.prisma.client;
    if (!prisma) {
      return null;
    }

    return prisma.user.findUnique({
      where: { email: this.normalizeEmail(email) }
    });
  }

  async findUserByPhone(phone: string) {
    const prisma = this.prisma.client;
    if (!prisma) {
      return null;
    }

    return prisma.user.findUnique({
      where: { phoneNumber: this.normalizePhone(phone) }
    });
  }

  async findUserById(id: string) {
    const prisma = this.prisma.client;
    if (!prisma) {
      return null;
    }

    return prisma.user.findUnique({ where: { id } });
  }

  generateToken() {
    return randomUUID();
  }
}
