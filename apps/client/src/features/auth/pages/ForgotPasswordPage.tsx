// JSX transform handles runtime import
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard, FormField, Label, Input, Button } from '@tirudesign/ui';

const schema = z.object({ email: z.string().email() });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => {
    // no fake API
    // eslint-disable-next-line no-console
    console.log('forgot password', data);
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Reset your password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} />
          </FormField>
          <Button type="submit">Send reset instructions</Button>
        </form>
      </AuthCard>
    </div>
  );
}
