/**
 * Dev/demo preview shell for the client dashboard.
 *
 * Renders the navy page chrome (matching rynk.ai) around the real dashboard
 * components with sample data and no auth, so the full flow can be viewed and
 * tested: /preview → clients list, /preview/:domain → that client's dashboard.
 */
import { Link, useParams } from 'react-router-dom';
import { ClientDashboard } from './ClientDashboard';
import { ClientsList } from './ClientsList';

export function PreviewDashboard() {
  const { domain } = useParams();

  return (
    <div className="relative min-h-screen bg-brand-ink text-brand-text">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 1200px 800px at 10% -8%, rgba(156,140,240,0.16), transparent 60%), radial-gradient(ellipse 1200px 800px at 90% -5%, rgba(109,141,255,0.16), transparent 60%)',
        }}
      />

      <header className="sticky top-0 z-50 border-b border-white/5 bg-brand-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
          <Link to="/preview" className="flex items-center gap-2.5">
            <img src="/rynklogo.png" alt="rynk.ai" className="h-12 w-auto" />
            <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">
              dashboard preview
            </span>
          </Link>
          {domain && (
            <Link to="/preview" className="font-mono text-[11px] text-brand-blueSoft hover:text-brand-text">
              ← all clients
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-screen-xl px-6 py-8">
        {domain ? <ClientDashboard /> : <ClientsList basePath="/preview" />}
      </main>
    </div>
  );
}
