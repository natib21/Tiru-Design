import { Button, AuthCard } from '@tirudesign/ui';

type ComingSoonPageProps = {
  title: string;
  description: string;
};

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <AuthCard>
      <h3 className="text-lg font-semibold wrap-break-word">{title}</h3>
      <p className="text-sm wrap-break-word mb-4">{description}</p>
      <Button type="button" variant="outline" disabled>
        Available in a later phase
      </Button>
    </AuthCard>
  );
}
