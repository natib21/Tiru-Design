// JSX transform handles runtime import
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthCard, FormField, Label, Input, PasswordInput, Button } from '@tirudesign/ui';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) });
  const onSubmit = (data: FormData) => {
    // Placeholder: integrate with real signup API later
    // eslint-disable-next-line no-console
    console.log('signup', data);
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Create an account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField>
            <Label htmlFor="displayName">Full name</Label>
            <Input id="displayName" {...register('displayName')} />
          </FormField>
          <FormField>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register('email')} />
          </FormField>
          <FormField>
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" {...register('password')} />
          </FormField>
          <Button type="submit">Sign up</Button>
        </form>
      </AuthCard>
    </div>
  );
}
