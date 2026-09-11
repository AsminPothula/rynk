/**
 * Create account — rynk-branded, wired to the real auth backend (useSignup).
 * Collects name + email + password; on success the user lands in the app and
 * adds their first site.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSignup } from '@/hooks/rq/mutations/useSignup';
import { NavigationRoutes } from '@/common/constant';
import { AuthShell, AuthField, AuthButton } from '@/components/auth-shell';

export const Signup = () => {
  const { mutate, isPending } = useSignup();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Use at least 8 characters for your password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    const [firstName, ...rest] = name.trim().split(' ');
    mutate(
      { email: email.trim(), password, firstName, lastName: rest.join(' ') },
      {
        onSuccess: () => {
          toast.success('Account created');
          navigate(NavigationRoutes.Dashboard);
        },
        onError: (err: any) => {
          const status = err?.response?.status;
          const msg = err?.response?.data?.message || '';
          if (status === 409 || /exist/i.test(msg)) {
            setError('An account with this email already exists — try signing in instead.');
          } else {
            setError(msg || 'Could not create your account. Please try again.');
          }
        },
      },
    );
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start getting found on Google and AI in minutes."
      footer={
        <>
          Already have an account?{' '}
          <button type="button" onClick={() => navigate(NavigationRoutes.SignIn)} className="font-medium text-brand-blueSoft hover:underline">
            Sign in
          </button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <AuthField label="Full name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        <AuthField label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
        <AuthField label="Password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
        <AuthField label="Confirm password" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" />

        {error && <p className="text-[13px] text-rose-400">{error}</p>}

        <AuthButton pending={isPending} type="submit">
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </AuthButton>
        <p className="text-center text-[11.5px] leading-relaxed text-brand-textMute">
          By creating an account you agree to rynk's Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
};
