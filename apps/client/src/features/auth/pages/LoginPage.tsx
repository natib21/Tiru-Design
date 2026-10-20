// React import not required with JSX transform
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard } from '@tirudesign/ui';
import { FormField } from '@tirudesign/ui';
import { Label } from '@tirudesign/ui';
import { Input } from '@tirudesign/ui';
import { PasswordInput } from '@tirudesign/ui';
import { Button } from '@tirudesign/ui';
import { Link } from '@tirudesign/ui';
import { authApi } from '@/features/auth/api/auth-api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => {
    // No backend call: emit event or integrate with real API later
    // Keep UX responsive
    // eslint-disable-next-line no-console
    console.log('login submit', data);
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Sign in to TiruDesign</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} />
          </FormField>
          <FormField>
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" {...register('password')} />
          </FormField>
          <div className="flex items-center justify-between">
            <div />
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <Button type="submit">Sign in</Button>
          <Button type="button" variant="outline" onClick={() => authApi.googleLogin()}>
            Continue with Google
          </Button>
        </form>
      </AuthCard>
    </div>
  );
}
