# apps/client Architecture

The client application follows a modular, feature-driven structure:

- **app/**: Application bootstrap, providers (React Query, i18n, toasts, error boundary), router, and shared layouts.
- **pages/**: Route-level page components, lazy-loaded by the app router.
- **features/**: Domain modules encapsulating business logic, state, and UI.
  - `features/auth`: User session store, query keys, and auth API hooks.
  - `features/workspaces`: Active workspace store with persistence.
  - `features/projects`: Project domain query key factory and operations.
- **shared/**: Cross-cutting utilities with no dependencies on features or app.
  - `shared/api`: Typed openapi-fetch client, ApiError mapping, refresh middleware, and query-client defaults.
  - `shared/config`: Environment variable validation with Zod.
  - `shared/hooks`: Reusable UI and lifecycle hooks.
  - `shared/i18n`: Internationalization setup with English and Amharic resources.
  - `shared/lib`: Generic helpers and utility functions (`cn`).
  - `shared/styles`: Global stylesheet importing Tailwind CSS.
  - `shared/ui`: Base design primitives and feedback components.
- **test/**: Vitest setup, MSW mock servers, and integration test suites.
Strict import boundaries are enforced via ESLint: shared cannot import features or app, and features only import public APIs.
