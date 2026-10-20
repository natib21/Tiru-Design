// JSX transform handles runtime import
import { AuthCard, Button } from '@tirudesign/ui';

export default function VerifyEmailPage() {
  const onResend = () => {
    // placeholder resend action
    // eslint-disable-next-line no-console
    console.log('resend verification');
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Verify your email</h2>
        <p className="text-sm text-muted-foreground mb-4">We've sent a verification link to your email address. Please follow the link to verify.</p>
        <div className="flex gap-2">
          <Button onClick={onResend}>Resend email</Button>
        </div>
      </AuthCard>
    </div>
  );
}
