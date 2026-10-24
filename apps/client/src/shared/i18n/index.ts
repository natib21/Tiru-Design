import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'auth';

export const resources = {
  en: {
    common: {
      appName: 'TiruDesign',
      enterprise: 'ENTERPRISE',
      support: 'Support',
      copyright: '© 2025 TiruDesign Enterprise. Grounded in creative empowerment.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      security: 'Security',
      needHelp: 'Need help? Contact support',
      whyDidThisHappen: 'Why did this happen?',
      whyLockoutDesc:
        'To protect your Ethiopian fonts, saved brand kits, and payment methods, TiruDesign halts access after 5 incorrect password inputs. You can request a password reset while you wait. Account security checks still apply.',
      whyLockoutDesktop:
        'The temporary lock helps protect your account. You can request a password reset while you wait. Account security checks still apply.',
      tryAgain: 'Try again',
      couldntConnect: "Couldn't connect",
      networkErrorDesc:
        'Check your internet connection and try again. Your details are still here.',
    },
    auth: {
      versionBadge: 'Tiru Studio v2.4',
      welcomePill: 'Welcome Back',
      creativeSuite: 'CREATIVE SUITE',
      welcomeTitle: 'Welcome back',
      loginSubtitle:
        'Log in to continue designing — access your templates, assets, and Ethiopian font libraries.',
      loginSubtitleMobile: 'Log in to continue designing your stories & prints',
      continueWithGoogle: 'Continue with Google',
      orDivider: 'OR •',
      orDividerDesktop: 'OR LOG IN WITH EMAIL',
      emailLabel: 'Email address',
      emailPlaceholder: 'alex@example.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      forgotPassword: 'Forgot password?',
      loginButton: 'Log in',
      signingIn: 'Signing in...',
      signingInHint: "Please wait. We're signing you in securely.",
      noAccount: "Don't have an account?",
      signupLink: 'Sign up',
      securityFooter: '256-bit Secure • Addis Ababa, ET',
      securityFooterDesktop:
        'Enterprise 256-bit SSL encrypted • Protected by reCAPTCHA',
      promoTitle: 'Ethiopian Creative Suite',
      promoBadge: 'PRO',
      promoDesc: "Native Ge'ez typography • 80+ Localized assets",

      authFailedTitle: 'Authentication failed',
      authFailedDesc: 'Please check your credentials.',
      incorrectPassword: 'Incorrect password. Please try again.',

      accountLockedTitle: 'Account temporarily locked',
      accountLockedDesc:
        'Too many failed login attempts. Please wait 15 minutes before trying again or reset your credentials now.',
      securityLockout: 'Security Lockout',
      tryAgainIn: 'Try again in',
      loginUnavailable: 'Log in unavailable',
      resetPasswordBtn: 'Reset your password',
      accountFrozen: 'Account Frozen',
      verifiedId: 'Verified ID',

      hubBadge: 'ADDIS CREATIVE HUB',
      hubTitle: 'Design localized. Create freely.',
      hubSubtitle: 'Join over 14,000+ creators across Ethiopia.',
      createAccountTitle: 'Create your account',
      signupSubtitle: 'Start designing in Amharic & English',
      phoneLabel: 'Phone number',
      phonePlaceholder: '9XXXXXXXX or 7XXXXXXXX',
      createPasswordPlaceholder: 'Create a password (min. 8 characters)',
      passwordHint: 'At least 8 characters with letters & numbers',
      agreeTerms: 'I agree to the',
      termsLink: 'Terms of Service',
      and: 'and',
      privacyLink: 'Privacy Policy',
      createAccountBtn: 'Create account',
      creatingAccount: 'Creating account...',
      fontStudioTag: 'Ethiopian Font Studio',
      fontStudioTitle: "300+ Ge'ez & Latin Fonts",
      fontStudioDesc: 'Included free with every new creator account',
      alreadyHaveAccount: 'Already have an account?',
      loginLink: 'Log in',

      fixErrorsBannerTitle: 'Please fix the errors below',
      fixErrorsBannerDesc:
        'Validation items require your attention before continuing.',
      emailInvalidMsg: 'Please enter a valid email address',
      phoneInvalidMsg:
        'Please enter a valid Ethiopian phone number (9XXXXXXXX or 7XXXXXXXX)',
      passwordInvalidMsg:
        'Password must be at least 8 characters and include a number',
      termsRequiredMsg: 'You must accept the Terms of Service to continue',
      strengthCritical: 'Strength: Critical',
      strengthWeak: 'Strength: Weak',
      strengthMedium: 'Strength: Medium',
      strengthStrong: 'Strength: Strong',
      tooWeak: 'Too weak',
      invalidFormat: 'Invalid format',
    },
  },
  am: {
    // Amharic falls back to English (TODO_AM from Figma)
    common: {},
    auth: {},
  },
} as const;

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'auth',
  ns: ['auth', 'common'],
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export { i18n };
export default i18n;
