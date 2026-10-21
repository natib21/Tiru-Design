#!/usr/bin/env tsx
/**
 * Script to grant platform admin role to a user by email
 * Usage: npx tsx scripts/make-admin.ts user@example.com
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { platformRole: 'ADMIN' },
      select: { id: true, email: true, name: true, platformRole: true },
    });

    console.log('✓ User is now a platform admin:');
    console.log(JSON.stringify(user, null, 2));
  } catch (error: any) {
    if (error.code === 'P2025') {
      console.error(`✗ User not found: ${email}`);
      process.exit(1);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: npx tsx scripts/make-admin.ts user@example.com');
  process.exit(1);
}

makeAdmin(email);
