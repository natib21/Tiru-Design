import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'missing-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'missing-google-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const email = profile.emails?.[0]?.value ?? null;
    const googleId = profile.id;

    if (!email || !googleId) {
      done(new Error('Google profile is missing an email or identifier'));
      return;
    }

    const payload = {
      id: profile.id,
      googleId,
      email,
      firstName: profile.name?.givenName ?? null,
      lastName: profile.name?.familyName ?? null,
      picture: profile.photos?.[0]?.value ?? null,
      accessToken,
      refreshToken,
    };

    done(null, payload);
  }
}
