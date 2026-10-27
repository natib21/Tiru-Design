import { useState } from 'react';
import { PasswordStrengthBar, PhoneInput, GoogleButton, CountdownTimer } from '@/shared/ui';

export default function DevAuthStatesPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'all'>('all');
  const [retryCount, setRetryCount] = useState(0);

  return (
    <div className="min-h-screen bg-surface-subtle p-6 text-text-primary">
      <header className="mb-8 border-b border-border-default pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Dev Auth States Review Gallery
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Isolated rendering of every visual and functional state for Login &amp; Signup (DEV ONLY).
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              activeTab === 'all'
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface border border-border-default text-text-secondary hover:text-text-primary'
            }`}
          >
            All States
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              activeTab === 'login'
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface border border-border-default text-text-secondary hover:text-text-primary'
            }`}
          >
            Login States
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
              activeTab === 'signup'
                ? 'bg-primary text-primary-contrast'
                : 'bg-surface border border-border-default text-text-secondary hover:text-text-primary'
            }`}
          >
            Signup States
          </button>
        </div>
      </header>

      {/* Grid of states */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ======================================================== */}
        {/* LOGIN STATES                                             */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'login') && (
          <>
            {/* 1. Login Default */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 01 Default Initial
                </span>
                <span className="rounded bg-brand-primary-surface px-2 py-0.5 text-xs font-medium text-brand-primary">
                  Empty
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Sign in to your account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Email address or phone number
                  </label>
                  <input
                    type="text"
                    placeholder="name@example.com or +251 91 123 4567"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-text-secondary">Password</label>
                    <span className="text-xs text-primary font-medium">Forgot password?</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm focus:border-primary focus:outline-none"
                    readOnly
                  />
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Sign in
                </button>
                <div className="relative my-4 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
                  <span className="relative bg-surface px-2 text-xs text-text-tertiary">Or continue with</span>
                </div>
                <GoogleButton onClick={() => {}} />
              </div>
            </div>

            {/* 2. Login Validation Errors */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 02 Client Validation Errors
                </span>
                <span className="rounded bg-danger-surface px-2 py-0.5 text-xs font-medium text-danger">
                  Invalid Input
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Sign in to your account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Email address or phone number
                  </label>
                  <input
                    type="text"
                    defaultValue="invalid-format"
                    className="w-full h-10 rounded-lg border border-danger bg-surface px-3 text-sm text-text-primary focus:outline-none"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-danger">Please enter a valid email or Ethiopian phone number</p>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-text-secondary">Password</label>
                    <span className="text-xs text-primary font-medium">Forgot password?</span>
                  </div>
                  <input
                    type="password"
                    defaultValue=""
                    className="w-full h-10 rounded-lg border border-danger bg-surface px-3 text-sm text-text-primary focus:outline-none"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-danger">Password is required</p>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Sign in
                </button>
              </div>
            </div>

            {/* 3. Login 401 Credential Error */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 03 Credential Error (401)
                </span>
                <span className="rounded bg-danger-surface px-2 py-0.5 text-xs font-medium text-danger">
                  401 Unauthorized
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Sign in to your account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Email address or phone number
                  </label>
                  <input
                    type="text"
                    defaultValue="user@example.com"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-text-secondary">Password</label>
                    <span className="text-xs text-primary font-medium">Forgot password?</span>
                  </div>
                  <input
                    type="password"
                    defaultValue="wrongpassword"
                    className="w-full h-10 rounded-lg border border-danger bg-surface px-3 text-sm"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-danger">Invalid credentials</p>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Sign in
                </button>
              </div>
            </div>

            {/* 4. Login 429 Rate Limit / Lockout State */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 04 Rate Limited Lockout (429)
                </span>
                <span className="rounded bg-warning-surface px-2 py-0.5 text-xs font-medium text-warning-text">
                  429 Lockout
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="rounded-lg border border-warning-surface bg-warning-surface/30 p-4 text-warning-text">
                  <div className="flex items-start gap-3">
                    <svg className="h-5 w-5 shrink-0 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h4 className="text-sm font-semibold text-warning-text">Too many attempts</h4>
                      <p className="mt-1 text-xs text-text-secondary">
                        Your account has been temporarily locked due to multiple failed login attempts.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs font-medium text-text-secondary">Try again in:</span>
                        <CountdownTimer initialSeconds={892} onZero={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>
                <button disabled className="w-full h-10 rounded-lg bg-surface-muted text-text-disabled font-medium text-sm cursor-not-allowed">
                  Sign in (Locked)
                </button>
              </div>
            </div>

            {/* 5. Login 500 / Network Error Banner */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 05 Network / Server Error (5xx / 403 / Unknown)
                </span>
                <span className="rounded bg-danger-surface px-2 py-0.5 text-xs font-medium text-danger-text">
                  Server Error Banner
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="rounded-lg border border-danger bg-danger-surface p-4 text-danger-text">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-danger-text">Network connection error</h4>
                      <p className="mt-1 text-xs text-danger-text/90">
                        Unable to connect to the authentication server. Please check your internet connection.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRetryCount((c) => c + 1)}
                      className="ml-3 rounded border border-danger-text/30 bg-surface px-2.5 py-1 text-xs font-medium text-danger-text hover:bg-danger-surface shadow-xs"
                    >
                      Retry {retryCount > 0 ? `(${retryCount})` : ''}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">
                    Email address or phone number
                  </label>
                  <input
                    type="text"
                    defaultValue="user@example.com"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm"
                    readOnly
                  />
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Sign in
                </button>
              </div>
            </div>

            {/* 6. Login Success Banner (?registered=true) */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Login &bull; 06 Registration Success Banner
                </span>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                  Redirected
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div className="rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium">Account created successfully! Please sign in.</p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-text-primary">Sign in to your account</h2>
                <input
                  type="text"
                  defaultValue="new_user@example.com"
                  className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm"
                  readOnly
                />
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Sign in
                </button>
              </div>
            </div>
          </>
        )}

        {/* ======================================================== */}
        {/* SIGNUP STATES                                            */}
        {/* ======================================================== */}
        {(activeTab === 'all' || activeTab === 'signup') && (
          <>
            {/* 1. Signup Default */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Signup &bull; 01 Default Initial
                </span>
                <span className="rounded bg-brand-primary-surface px-2 py-0.5 text-xs font-medium text-brand-primary">
                  Empty
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Create an account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Email address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Phone number (optional)</label>
                  <PhoneInput value="" onChange={() => {}} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full h-10 rounded-lg border border-border-default bg-surface px-3 text-sm"
                    readOnly
                  />
                  <div className="mt-2">
                    <PasswordStrengthBar score={0} label="" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border-default" readOnly />
                  <span className="text-xs text-text-secondary">I agree to the Terms of Service &amp; Privacy Policy</span>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Create account
                </button>
              </div>
            </div>

            {/* 2. Signup Password Strength Levels */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Signup &bull; 02 Password Strength Meter
                </span>
                <span className="rounded bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
                  Scores 1-4
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-1">Level 1: Critical</p>
                  <PasswordStrengthBar score={1} label="Strength: Critical" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-1">Level 2: Weak</p>
                  <PasswordStrengthBar score={2} label="Strength: Weak" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-1">Level 3: Medium</p>
                  <PasswordStrengthBar score={3} label="Strength: Medium" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary mb-1">Level 4: Strong</p>
                  <PasswordStrengthBar score={4} label="Strength: Strong" />
                </div>
              </div>
            </div>

            {/* 3. Signup 409 Conflict: Email Exists */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Signup &bull; 03 Email Already Registered (409)
                </span>
                <span className="rounded bg-danger-surface px-2 py-0.5 text-xs font-medium text-danger">
                  Conflict
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Create an account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Email address</label>
                  <input
                    type="email"
                    defaultValue="existing@tirudesign.com"
                    className="w-full h-10 rounded-lg border border-danger bg-surface px-3 text-sm focus:outline-none"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-danger">Email already registered</p>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Create account
                </button>
              </div>
            </div>

            {/* 4. Signup 409 Conflict: Phone Exists */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Signup &bull; 04 Phone Already Registered (409)
                </span>
                <span className="rounded bg-danger-surface px-2 py-0.5 text-xs font-medium text-danger">
                  Conflict
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Create an account</h2>
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1">Phone number</label>
                  <PhoneInput value="+251911234567" onChange={() => {}} hasError />
                  <p className="mt-1 text-xs text-danger">Phone number already registered</p>
                </div>
                <button className="w-full h-10 rounded-lg bg-primary text-primary-contrast font-medium text-sm">
                  Create account
                </button>
              </div>
            </div>

            {/* 5. Signup Loading State */}
            <div className="rounded-xl border border-border-default bg-surface p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-border-subtle pb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                  Signup &bull; 05 Submitting / Loading
                </span>
                <span className="rounded bg-brand-primary-surface px-2 py-0.5 text-xs font-medium text-brand-primary">
                  In Flight
                </span>
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h2 className="text-xl font-bold text-text-primary">Create an account</h2>
                <button disabled className="w-full h-10 rounded-lg bg-primary/70 text-primary-contrast font-medium text-sm flex items-center justify-center gap-2 cursor-wait">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Creating account...</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
