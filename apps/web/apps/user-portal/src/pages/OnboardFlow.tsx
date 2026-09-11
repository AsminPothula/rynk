/**
 * Add a site — the entry step of the real first run.
 *
 *   URL entry → onboard (scrape + AI extract, ~1 min) → hand off to the client
 *   dashboard, whose first-run wizard takes over: confirm Profile → confirm
 *   Settings → run Layers 1-3 → populated dashboard.
 *
 * This screen ONLY onboards + navigates; the confirmation + run steps live on
 * the dashboard (ClientDashboard first-run wizard) so there's one implementation.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertTriangle, Search } from 'lucide-react';
import { useOnboardClient } from '@shared/hooks/rq/mutations/useOnboardClient';

type Stage = 'idle' | 'onboarding' | 'error';

export function OnboardFlow() {
  const navigate = useNavigate();
  const onboard = useOnboardClient();
  const [stage, setStage] = useState<Stage>('idle');
  const [url, setUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function start(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    setErrorMsg('');
    setStage('onboarding');
    try {
      const client = await onboard.mutateAsync({ url: trimmed });
      // Hand off to the dashboard; its first-run wizard resumes at "confirm
      // profile" because the client is onboarded but has no run yet.
      navigate(`/clients/${client.domain}`);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          err?.message ||
          'Could not onboard that site. Check the URL is reachable and try again.',
      );
      setStage('error');
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-10 text-brand-text">
      {stage === 'idle' && <UrlEntry url={url} setUrl={setUrl} onSubmit={start} />}
      {stage === 'onboarding' && <Onboarding />}
      {stage === 'error' && (
        <ErrorView message={errorMsg} onRetry={() => setStage('idle')} />
      )}
    </div>
  );
}

function UrlEntry({ url, setUrl, onSubmit }: { url: string; setUrl: (v: string) => void; onSubmit: (e: React.FormEvent) => void }) {
  return (
    <div className="text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft">New site</p>
      <h1 className="mt-3 font-serif text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight">
        Add a site to <span className="italic text-brand-blueSoft">rynk</span>
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-brand-textMute">
        Enter a website URL. rynk crawls it live and learns the business — then you confirm the profile and publishing, and it optimizes everything automatically.
      </p>

      <form
        onSubmit={onSubmit}
        className="group relative mx-auto mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-white/[0.06] py-2 pl-6 pr-2 ring-1 ring-white/12 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
      >
        <Search className="h-4 w-4 shrink-0 text-brand-violetSoft" />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="www.yoursite.com"
          aria-label="Website URL"
          className="min-w-0 flex-1 bg-transparent font-serif text-[16px] text-brand-text placeholder:text-brand-textMute focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Start"
          className="flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-white px-5 font-serif text-[15px] font-medium text-brand-ink transition-all group-hover:scale-[1.02]"
        >
          Start <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-3 font-mono text-[11px] text-brand-textMute">This takes about a minute. rynk does not publish anything to your site.</p>
    </div>
  );
}

function Onboarding() {
  const notes = [
    'Reading your website…',
    'Understanding your services…',
    'Finding your competitors…',
    'Building your business profile…',
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % notes.length), 1400);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="py-16 text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-blueSoft" />
      <h2 className="mt-6 font-serif text-2xl md:text-3xl font-medium tracking-tight">Getting to know your business…</h2>
      <p className="mt-3 font-mono text-[13px] text-brand-textMute">{notes[i]}</p>
      <p className="mx-auto mt-6 max-w-sm text-[12.5px] leading-relaxed text-brand-textMute">
        rynk is crawling your live site and extracting who you are. This usually takes about a minute.
      </p>
    </div>
  );
}

function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="py-16 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
      <h2 className="mt-6 font-serif text-2xl font-medium tracking-tight">That didn't work</h2>
      <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-brand-textMute">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 font-serif text-[15px] font-medium text-brand-ink"
      >
        Try another URL
      </button>
    </div>
  );
}
