/**
 * Sign in — rynk-branded, wired to the real auth backend (useLogin).
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin } from '@/hooks/rq/mutations/useLogin';
import { NavigationRoutes } from '@/common/constant';
import { AuthShell, AuthField, AuthButton } from '@/components/auth-shell';

export const Login = () => {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          toast.success('Welcome back');
          navigate(NavigationRoutes.Dashboard);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          setError(
            status === 401 || status === 404
              ? "That email and password don't match. Try again, or create an account."
              : err?.response?.data?.message || 'Could not sign you in. Please try again.',
          );
        },
      },
    );
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back — pick up where you left off."
      footer={
        <>
          New to rynk?{' '}
          <button type="button" onClick={() => navigate(NavigationRoutes.SignUp)} className="font-medium text-brand-blueSoft hover:underline">
            Create an account
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wide text-brand-textMute">Password</span>
            <button type="button" onClick={() => navigate(NavigationRoutes.ForgotPassword)} className="text-[12px] text-brand-blueSoft hover:underline">
              Forgot password?
            </button>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl bg-white/[0.04] px-4 py-2.5 text-[15px] text-brand-text placeholder:text-brand-textMute/60 outline-none ring-1 ring-white/12 transition-colors focus:ring-brand-blue/60"
          />
        </div>

        {error && <p className="text-[13px] text-rose-400">{error}</p>}

        <AuthButton pending={isPending} type="submit">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </AuthButton>
      </form>
    </AuthShell>
  );
};
