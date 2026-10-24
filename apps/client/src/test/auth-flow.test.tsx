import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { HttpResponse, http } from 'msw';
import { setupServer } from 'msw/node';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';
import { useAuthStore } from '@/features/auth/auth-store';
import {
  parseLockoutDuration,
  mapAuthErrorToState,
} from '@/features/auth/utils/auth-error-mapper';
import {
  loginFormSchema,
  signupFormSchema,
  ethPhoneRegex,
} from '@/features/auth/schemas/auth';
import { CountdownTimer } from '@/shared/ui/countdown-timer';
import { ApiError } from '@/shared/api';
import '@/shared/i18n';

const server = setupServer();

beforeEach(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
  useAuthStore.getState().clearSession();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  server.close();
  vi.restoreAllMocks();
});

describe('1. Form Validation Tests', () => {
  describe('Phone number validation (Ethiopian format)', () => {
    it('accepts valid 9-digit numbers starting with 9 or 7', () => {
      expect(ethPhoneRegex.test('911234567')).toBe(true);
      expect(ethPhoneRegex.test('712345678')).toBe(true);
      expect(ethPhoneRegex.test('987654321')).toBe(true);
    });

    it('rejects numbers not starting with 9 or 7 or wrong length', () => {
      expect(ethPhoneRegex.test('811234567')).toBe(false);
      expect(ethPhoneRegex.test('611234567')).toBe(false);
      expect(ethPhoneRegex.test('91123456')).toBe(false); // 8 digits
      expect(ethPhoneRegex.test('9112345678')).toBe(false); // 10 digits
      expect(ethPhoneRegex.test('abc123456')).toBe(false);
    });
  });

  describe('Login Form Schema Validation', () => {
    it('validates required email and min 8 char password', () => {
      const invalid = loginFormSchema.safeParse({ email: 'bad-email', password: '123' });
      expect(invalid.success).toBe(false);
      if (!invalid.success) {
        const issues = invalid.error.issues;
        expect(issues.some((i) => i.path.includes('email'))).toBe(true);
        expect(issues.some((i) => i.path.includes('password'))).toBe(true);
      }

      const valid = loginFormSchema.safeParse({
        email: 'alex@example.com',
        password: 'ValidPassword123',
      });
      expect(valid.success).toBe(true);
    });
  });

  describe('Signup Form Schema Validation', () => {
    it('requires valid email, valid Ethiopian phone, letter+number password, and terms', () => {
      const empty = signupFormSchema.safeParse({
        email: '',
        phone: '',
        password: '',
        agreeTerms: false,
      });
      expect(empty.success).toBe(false);

      const invalidPhone = signupFormSchema.safeParse({
        email: 'alex@example.com',
        phone: '123456789',
        password: 'Password1',
        agreeTerms: true,
      });
      expect(invalidPhone.success).toBe(false);

      const valid = signupFormSchema.safeParse({
        email: 'alex@example.com',
        phone: '911234567',
        password: 'Password123',
        agreeTerms: true,
      });
      expect(valid.success).toBe(true);
    });
  });
});

describe('2. Error Mapping & Lockout Duration Parser Tests', () => {
  it('maps HTTP 401 to incorrect_password state', () => {
    const error = new ApiError(401, 'UNAUTHORIZED', 'Invalid credentials');
    const mapped = mapAuthErrorToState(error);
    expect(mapped.state).toBe('incorrect_password');
    expect(mapped.message).toContain('Incorrect password');
  });

  it('maps HTTP 429 to account_locked state and extracts duration', () => {
    const headers = new Headers();
    headers.set('retry-after', '600');
    const error = new ApiError(429, 'TOO_MANY_REQUESTS', 'Rate limit exceeded', undefined, undefined, headers);

    const mapped = mapAuthErrorToState(error);
    expect(mapped.state).toBe('account_locked');
    expect(mapped.lockoutSeconds).toBe(600);
  });

  it('maps HTTP 400 and 409 to validation_error state', () => {
    const error400 = new ApiError(400, 'BAD_REQUEST', 'Validation failed');
    expect(mapAuthErrorToState(error400).state).toBe('validation_error');

    const error409 = new ApiError(409, 'CONFLICT', 'User already exists');
    expect(mapAuthErrorToState(error409).state).toBe('validation_error');
  });

  it('maps network errors to network_error state', () => {
    const networkErr = new TypeError('Failed to fetch');
    const mapped = mapAuthErrorToState(networkErr);
    expect(mapped.state).toBe('network_error');
    expect(mapped.message).toContain("Couldn't connect");
  });

  describe('parseLockoutDuration hierarchy (Retry-After -> retryAfterSeconds -> timestamp -> 900s)', () => {
    it('1. reads numeric Retry-After header', () => {
      const headers = new Headers({ 'retry-after': '300' });
      expect(parseLockoutDuration({ headers })).toBe(300);
    });

    it('2. reads HTTP-Date Retry-After header', () => {
      const futureDate = new Date(Date.now() + 450 * 1000).toUTCString();
      const headers = new Headers({ 'retry-after': futureDate });
      const duration = parseLockoutDuration({ headers });
      expect(duration).toBeGreaterThanOrEqual(448);
      expect(duration).toBeLessThanOrEqual(452);
    });

    it('3. reads retryAfterSeconds payload when header is missing', () => {
      expect(parseLockoutDuration({ data: { retryAfterSeconds: 420 } })).toBe(420);
    });

    it('4. reads ISO timestamp in error message when header and payload field are missing', () => {
      const futureIso = new Date(Date.now() + 180 * 1000).toISOString();
      const duration = parseLockoutDuration({ message: `Lockout until ${futureIso}` });
      expect(duration).toBeGreaterThanOrEqual(178);
      expect(duration).toBeLessThanOrEqual(182);
    });

    it('5. defaults to 900 seconds when no timing information is found', () => {
      expect(parseLockoutDuration({})).toBe(900);
      expect(parseLockoutDuration(new Error('Generic 429'))).toBe(900);
    });
  });
});

describe('3. Account Locked Countdown Timer Tests', () => {
  it('renders countdown formatted as MM:SS and fires onZero', async () => {
    vi.useFakeTimers();
    const onZero = vi.fn();

    render(<CountdownTimer initialSeconds={3} onZero={onZero} />);
    expect(screen.getByRole('timer')).toHaveTextContent('00:03');

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:02');

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    expect(onZero).toHaveBeenCalled();

    vi.useRealTimers();
  });
});

describe('4. Full Login Flow Tests', () => {
  it('stores session tokens in useAuthStore and localStorage upon successful login', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json({
          user: {
            id: 'usr-123',
            email: 'alex@example.com',
            phoneNumber: '+251911234567',
            emailVerified: true,
            phoneVerified: true,
            status: 'ACTIVE',
          },
          accessToken: 'mock-access-token-abc',
          refreshToken: 'mock-refresh-token-xyz',
          expiresAt: new Date(Date.now() + 900000).toISOString(),
        });
      })
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/^Email address/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const submitBtn = screen.getByRole('button', { name: /Log in/i });

    await user.type(emailInput, 'alex@example.com');
    await user.type(passwordInput, 'SecretPassword123');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('mock-access-token-abc');
    expect(state.refreshToken).toBe('mock-refresh-token-xyz');
    expect(localStorage.getItem('tirudesign_refresh_token')).toBe('mock-refresh-token-xyz');
  });

  it('displays incorrect password banner and helper message on 401', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json(
          { statusCode: 401, error: 'UNAUTHORIZED', message: 'Invalid credentials' },
          { status: 401 }
        );
      })
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Email address/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/^Password/i), 'WrongPassword123');
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
      expect(screen.getByText(/Incorrect password\. Please try again\./i)).toBeInTheDocument();
    });
  });

  it('displays account locked countdown on 429 and disables login form', async () => {
    server.use(
      http.post('*/auth/login', () => {
        return HttpResponse.json(
          { statusCode: 429, error: 'TOO_MANY_REQUESTS', message: 'Too many attempts' },
          {
            status: 429,
            headers: {
              'Retry-After': '900',
            },
          }
        );
      })
    );

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    );

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Email address/i), 'alex@example.com');
    await user.type(screen.getByLabelText(/^Password/i), 'WrongPassword123');
    await user.click(screen.getByRole('button', { name: /Log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Account temporarily locked/i)).toBeInTheDocument();
      expect(screen.getByText(/Security Lockout/i)).toBeInTheDocument();
      expect(screen.getByText(/Log in unavailable/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Reset your password/i })).toBeInTheDocument();
    });

    // Form inputs must be disabled during lockout
    expect(screen.getByLabelText(/^Email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/^Password/i)).toBeDisabled();
  });
});

describe('5. Full Signup Flow Tests', () => {
  it('sends formatted +251 phone number and stores session on registration', async () => {
    let capturedBody: unknown = null;

    server.use(
      http.post('*/auth/register', async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json({
          user: {
            id: 'usr-new-456',
            email: 'newuser@example.com',
            phoneNumber: '+251911234567',
            emailVerified: false,
            phoneVerified: false,
            status: 'ACTIVE',
          },
          accessToken: 'new-user-access-token',
          refreshToken: 'new-user-refresh-token',
          expiresAt: new Date(Date.now() + 900000).toISOString(),
        });
      })
    );

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText(/^Email address/i);
    const phoneInput = screen.getByLabelText(/^Phone number/i);
    const passwordInput = screen.getByLabelText(/^Password/i);
    const termsCheckbox = screen.getByRole('checkbox');
    const submitBtn = screen.getByRole('button', { name: /Create account/i });

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(phoneInput, { target: { value: '911234567' } });
    fireEvent.change(passwordInput, { target: { value: 'ValidPass123' } });
    fireEvent.click(termsCheckbox);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    });

    expect(capturedBody).toEqual({
      email: 'newuser@example.com',
      phoneNumber: '+251911234567',
      password: 'ValidPass123',
    });

    expect(useAuthStore.getState().accessToken).toBe('new-user-access-token');
    expect(useAuthStore.getState().refreshToken).toBe('new-user-refresh-token');
  });
});
