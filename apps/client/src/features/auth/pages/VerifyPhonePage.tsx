import { useState } from 'react';
import { AuthCard, OTPInput, Button } from '@tirudesign/ui';

export default function VerifyPhonePage() {
  const [code, setCode] = useState('');
  const onSubmit = () => {
    // placeholder: verify code with backend later
    // eslint-disable-next-line no-console
    console.log('verify code', code);
  };

  return (
    <div className="min-h-svh flex items-center justify-center">
      <AuthCard>
        <h2 className="text-2xl font-semibold mb-4">Verify phone</h2>
        <div className="flex flex-col gap-4">
          <OTPInput length={6} value={code} onChange={setCode} />
          <Button onClick={onSubmit}>Verify</Button>
        </div>
      </AuthCard>
    </div>
  );
}
