# Shared Package

Shared code used by both `user-portal` and `admin-portal`.

## Component Architecture

```
packages/shared/src/
├── components/
│   ├── ui/              # shadcn/radix primitives (Button, Card, Dialog, etc.)
│   ├── common/          # Composed reusable components (BarChart, PageTitle, SideNavbar, UserCard, etc.)
│   └── icons/           # SVG icon components
├── containers/          # Composed sections + route interceptors (Dashboard, Register forms, Auth/Profile interceptors, RoleRouteGuard)
├── pages/               # Fully shared pages (Settings)
├── hooks/               # React hooks (mutations, queries, UI creators)
├── providers/           # Context providers (ApiProvider, LanguageProviderCreator)
├── state/               # Zustand stores (useAuthStore, useUIPreferencesStore, useInactivityStore)
├── setup/               # App initialization (initApp, auth transitions, store devtools)
├── common/              # Constants, API setup, HTTP client
├── lib/                 # Utilities, helpers, validators, storage
├── _api/                # Auto-generated OpenAPI client
└── mocks/               # MSW mock handlers
```

### Layer Descriptions

| Layer                  | Purpose                                                                   | Example                                                                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`                  | Low-level primitives from shadcn. Never import app-specific code.         | `Button`, `Card`, `Dialog`                                                                                                                                                 |
| `common/` (components) | Composed UI built from `ui/` primitives. May use shared `lib/` utilities. | `BarChart`, `DataCard`, `SideNavbar`                                                                                                                                       |
| `containers/`          | Assembled sections + route-level components. Accept data via props.       | `DashboardOverview`, `DashboardSales`, `LoginForm`, `SignupForm`, `ForgotPasswordForm`, `SetPasswordForm`, `AuthTokensInterceptor`, `ProfileInterceptor`, `RoleRouteGuard` |
| `pages/`               | Full page components that use Zustand stores and `useApiContext()`.       | `Settings`                                                                                                                                                                 |

## Sharing Patterns

### Pattern A: Fully Shared Page

The page lives entirely in shared. Each app renders it with a thin wrapper that provides the translation function.

```tsx
// packages/shared/src/pages/Settings.tsx
export function Settings({ t, showDeleteAccount }: SettingsPageProps) {
  const authData = useAuthStore((s) => s.authData); // from Zustand store
  const api = useApiContext(); // from shared provider
  // ... full page implementation
}

// apps/user-portal/src/pages/Settings/Settings.tsx
import { Settings as SharedSettings } from '@shared/pages/Settings';
import { useLanguageTranslation } from '@/hooks/ui/useLanguageTranslation';

export const Settings = () => {
  const { t } = useLanguageTranslation();
  return <SharedSettings t={t} showDeleteAccount={true} />;
};
```

**When to use:** Pages that are 90%+ identical across portals. Differences handled via props.

### Pattern B: Shared Containers, Different Composition

Shared containers handle rendering sections. Each app composes them differently.

```tsx
// packages/shared/src/containers/DashboardOverview.tsx
export function DashboardOverview({ barData, isLoading }: Props) { ... }

// apps/user-portal/src/pages/Dashboard.tsx — adds LineChart + PieChart
<DashboardOverview barData={barData} isLoading={isLoading} />
<DashboardSales salesData={salesData} isLoading={isLoading} />
<LineChart />
<PieChart />

// apps/admin-portal/src/pages/Dashboard.tsx — overview + sales only
<DashboardOverview barData={barData} isLoading={isLoading} />
<DashboardSales salesData={salesData} isLoading={isLoading} />
```

**When to use:** Pages with shared sections but different layouts or extra portal-specific content.

### Pattern C: Shared UI, Different Data Source

Components accept data and callbacks as props. Each portal wires its own data.

```tsx
// Shared component — pure UI
export default function SideNavbar({ isCollapsed, setIsCollapsed, labels }: Props) { ... }

// App wrapper — provides translated labels
export default function SideNavbar(props) {
  const { t } = useLanguageTranslation();
  return <SharedSideNavbar {...props} labels={{ dashboard: t('NAVBAR.DASHBOARD'), ... }} />;
}
```

**When to use:** Components that need portal-specific hooks (translations, themes, etc.).

### Pattern D: Shared Form + Injected Mutation (Register Forms)

The form container owns UI, validation, and error handling. The app injects the mutation hook result and success callbacks. This allows each portal to use different API endpoints while sharing identical form logic.

```tsx
// Shared container — owns form UI, zod schema, error toasts
export function LoginForm({
  mutation,
  t,
  onSuccess,
  onForgotPassword,
  onSignUp,
}: Props) {
  const { mutate, isPending, error, isError } = mutation;
  // form setup, validation, full JSX — all shared
  // calls mutate(data, { onSuccess })
}

// App page — thin wrapper, ~10 lines
import { LoginForm } from '@shared/containers/register/LoginForm';
import { useLogin } from '@/hooks/rq/mutations/useLogin'; // admin could use useAdminLogin

export const Login = () => {
  const mutation = useLogin();
  const navigate = useNavigate();
  const { t } = useLanguageTranslation();
  return (
    <LoginForm
      mutation={mutation}
      t={t}
      onSuccess={() => {
        toast.success(t('LOGIN.TOAST.SUCCESS'));
        navigate('/dashboard');
      }}
      onForgotPassword={() => navigate('/forgot-password')}
      onSignUp={() => navigate('/sign-up')}
    />
  );
};
```

**When to use:** Forms that are visually identical across portals but may call different API endpoints. The mutation hook is the swappable part — everything else is shared.

### Pattern E: Extensible Shared Form (Signup with Portal-Specific Fields)

When portals share the same base form but each needs different extra fields, use **render slots**. The shared container defines the core fields (email, password, confirmPassword) and provides two injection points:

- `renderExtraFields(form)` — between email and password fields
- `renderAfterPasswords(form)` — after the password fields

Each portal extends the base zod schema with its extra fields and renders them in the slots.

```tsx
// Shared — exports base schema + password-match helper
export const SignupBaseSchema = z.object({ email, password, confirmPassword });
export function withPasswordMatch(schema) { return schema.refine(...); }

// User-portal — adds phone + terms checkbox
const UserSchema = withPasswordMatch(SignupBaseSchema.extend({
  phone: z.string().refine(isValidPhoneNumber).optional(),
  acceptTerms: z.boolean().refine(val => val === true, 'Required'),
}));

<SignupForm
  schema={UserSchema}
  defaultValues={{ email: '', phone: '', password: '', confirmPassword: '', acceptTerms: false }}
  onSubmit={(data) => mutate({ email: data.email, password: data.password, phone: data.phone })}
  renderExtraFields={(form) => (
    <FormField control={form.control} name="phone" render={...} />
  )}
  renderAfterPasswords={(form) => (
    <FormField control={form.control} name="acceptTerms" render={...} />
  )}
/>

// Admin-portal — adds invite code, no phone or terms
const AdminSchema = withPasswordMatch(SignupBaseSchema.extend({
  inviteCode: z.string().min(1, 'Required'),
}));

<SignupForm
  schema={AdminSchema}
  defaultValues={{ email: '', inviteCode: '', password: '', confirmPassword: '' }}
  onSubmit={(data) => mutate({ email: data.email, password: data.password })}
  renderExtraFields={(form) => (
    <FormField control={form.control} name="inviteCode" render={...} />
  )}
/>
```

**Key design decisions:**

- **Form data ≠ mutation data** — the `onSubmit` callback maps form fields to what the API needs. UI-only fields like `acceptTerms` never reach the API.
- **Schema is passed as a prop** — each portal owns its validation. The shared container just runs it.
- **Zod runtime validation** — extra fields are validated by the extended schema at runtime. No fragile TypeScript generics needed.

**When to use:** Forms that share 70-90% of their UI but each portal needs to add, remove, or replace specific fields. If portals share <50% of the form, write separate forms.

**Landing/Example pages** are kept separate per portal to demonstrate different UI customization per app.

## Role-Based Access & Per-Portal Configuration

### AllowedRoles — Per-Portal Role Sets

Each app defines its own `AllowedRoles` constant in `common/constant.ts`. This avoids hardcoding role enums in router files and provides a single place to manage access policies per portal.

```ts
// apps/user-portal/src/common/constant.ts
import { UserProfileRole } from 'shared';

export const AllowedRoles = {
  All: [UserProfileRole.User, UserProfileRole.Admin, UserProfileRole.Guest],
  Authenticated: [UserProfileRole.User, UserProfileRole.Admin],
  AdminOnly: [UserProfileRole.Admin],
} as const;

// apps/admin-portal/src/common/constant.ts
export const AllowedRoles = {
  All: [UserProfileRole.Admin], // admin portal — admin only
} as const;
```

Usage in router:

```tsx
import { AllowedRoles } from '../common/constant';

<RoleRouteGuard allowedRoles={AllowedRoles.All}>
  <Users />
</RoleRouteGuard>;
```

The shared `RoleRouteGuard` doesn't know what the roles are — it just checks `canAccess(allowedRoles)` against the user's profile. Role definitions come from the API, allowed lists come from each app's config.

### ProfileInterceptor — Swappable Profile Fetch

The shared `ProfileInterceptor` accepts an optional `fetchProfile` prop. By default it calls `api.userApi.getMyProfile()`, but each portal can override it to use a different endpoint.

```tsx
// Shared — default behavior
<ProfileInterceptor>
  <PrivateRoute />
</ProfileInterceptor>;

// Admin portal — custom profile endpoint (when APIs diverge)
const fetchAdminProfile = (api: ApiEndpoints) =>
  api.adminApi.getMyAdminProfile(); // different endpoint

export const ProfileInterceptor = ({ children }) => (
  <SharedProfileInterceptor fetchProfile={fetchAdminProfile}>
    {children}
  </SharedProfileInterceptor>
);
```

Both portals currently hit the same API structure (just different base URLs). When the admin API adds a separate profile endpoint, change one line in the admin wrapper — zero changes to shared code or user-portal.

### Extending to Other Shared Components

The same pattern applies anywhere portals may diverge:

- **Different login endpoint?** Swap `useLogin()` for `useAdminLogin()` in the Login page wrapper
- **Different profile fields?** Override `fetchProfile` in the ProfileInterceptor wrapper
- **Different role requirements?** Change `AllowedRoles` in the app's constants

The key principle: **shared code never contains portal-specific logic**. All divergence is handled by the app's thin wrapper or config.

## When to Share vs Keep Separate

**Share when:**

- Code is identical or nearly identical in both apps
- Component is pure UI (no app-specific hooks)
- Business logic is the same (same API calls, same state mutations)

**Keep separate when:**

- Only one portal uses it
- Heavy portal-specific customization would require many props/flags
- Component is tightly coupled to portal-specific routing or layout

**Warning signs that sharing has gone too far:**

- More than 3-4 portal-specific boolean props
- `if (isAdmin)` / `if (isUserPortal)` branches inside shared code
- Shared component grows complex to accommodate portal differences

## When to Clone Instead of Share

Sharing isn't always the right choice. Here's how to decide.

### The Litmus Test

**If the app wrapper is longer than ~40 lines, or you're fighting the shared component to make it do what you want — clone it.** 30 lines of duplicated form JSX is cheaper than a complex abstraction nobody can reason about.

### Clone when:

- **<50% shared UI** — more fields are different than same. At that point the shared component is mostly slots and configuration, not actual shared code.
- **Different layout structure** — one portal uses a wizard/stepper, the other a single-page form. The Card/Form/Footer structure is baked into the shared container.
- **Core fields need to change** — one portal replaces email with username, or reorders the base fields. The shared component's field ordering is fixed.
- **3+ render slots needed** — if you find yourself adding `renderBeforeEmail`, `renderBetweenFields`, `renderAfterPhone`, `renderBeforePassword`... you've turned the component into a layout engine. Just copy it.
- **Diverging validation flows** — one portal needs async server-side validation (e.g., check invite code on blur), the other doesn't. Mixing sync and async validation in a shared form adds complexity that isn't worth the sharing benefit.
- **One portal's version is changing rapidly** — if a feature is under active development in one portal, sharing creates coordination overhead. Clone it, stabilize it, then evaluate sharing again.

### How to clone safely

1. Copy the shared container into the app's `pages/` or `components/` directory
2. Replace the re-export/wrapper with the full component
3. Remove any slot props or configuration that your portal doesn't need
4. The other portal is unaffected — it still uses the shared version

This works because the re-export pattern is the safety valve. Every app file is already a thin wrapper around the shared version. "Un-sharing" means replacing one file — no grep-and-replace, no impact on the other portal.

### The real maintenance risk

The risk with shared code isn't technical — it's coordination. A developer modifying shared code for one portal might break the other. Mitigations:

- **Both portals build in CI** — a breaking change in shared fails both builds immediately
- **Thin wrappers everywhere** — shared code has no portal-specific logic, so changes to shared are always intentionally general
- **Easy to un-share** — if coordination cost exceeds sharing benefit, clone and move on. You're never locked in.

## Adding a New Shared Component

1. Create the component in `packages/shared/src/components/common/`
2. Use relative imports within shared (`../../lib/utils`, `../ui/button`)
3. Export from `packages/shared/src/components/common/index.ts`
4. If the component needs portal-specific hooks, accept data via props
5. Create thin wrappers in each app that inject hook data
6. Update app imports from `@/components/foo` to `@shared/components/common/foo`
7. Delete the original from the app

## Provider Architecture

Both apps wrap their tree with these shared providers:

```ts
// Module scope — runs once before React renders
initApp({ storeDevtools });
```

```tsx
// Component tree
<ApiContextProvider value={api}>        {/* API client access via useApiContext() */}
  <QueryClientProvider>                 {/* React Query */}
    <LanguageProvider>                  {/* i18next (per-app locales) */}
      <ThemeProvider>                   {/* Dark/light mode */}
        <HydrationGate stores={[...]}>  {/* Wait for Zustand stores to hydrate */}
          <InactivityProviderZustand>   {/* Inactivity auto-logout + warning dialog */}
            <Router />
          </InactivityProviderZustand>
        </HydrationGate>
      </ThemeProvider>
    </LanguageProvider>
  </QueryClientProvider>
</ApiContextProvider>
```

`initApp()` registers auth transition callbacks (logout cleanup) and optionally mounts store devtools. `useAppCrossTabSync()` is called inside `App` to sync persisted stores across tabs. Zustand stores are accessed directly via hooks — no context provider needed for state. See [docs/cross-tab-sync.md](docs/cross-tab-sync.md).

## What Each App Keeps

- `hooks/ui/useLanguage.tsx` — one-liner with `createUseLanguage`
- `hooks/ui/useLanguageTranslation.tsx` — one-liner with `createUseLanguageTranslation`
- `hooks/useSetupGlobalApiConfig.ts` — wrapper passing `apiEndpoint` + configuring interceptors
- `providers/LanguageProvider.tsx` — uses creator with app-specific locales
- `common/locales/` — portal-specific translations
- `config/env.ts` — portal-specific environment variables
- `router/` — portal-specific routing
- `pages/Register/` — thin wrappers injecting mutation hooks into shared form containers
- `pages/Register/Landing.tsx` — portal-specific landing page (kept separate for different UIs)
- `App.tsx` — provider composition
- `main.tsx` — entry point
