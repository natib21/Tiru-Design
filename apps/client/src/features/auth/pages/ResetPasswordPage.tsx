// JSX transform handles runtime import
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard, FormField, Label, PasswordInput, Button } from '@tirudesign/ui';

const schema = z.object({ password: z.string().min(6), confirm: z.string().min(6) }).refine((d) => d.password === d.confirm, { message: 'Passwords must match', path: ['confirm'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => {
    // placeholder
    // eslint-disable-next-line no-console
    console.log('reset', data);
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Reset password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="password">New password</Label>
            <PasswordInput id="password" {...register('password')} />
          </FormField>
          <FormField>
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput id="confirm" {...register('confirm')} />
          </FormField>
          <Button type="submit">Set new password</Button>
        </form>
      </AuthCard>
    </div>
  );
}
