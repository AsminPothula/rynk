/**
 * Authed, real-data wrapper around the polished ClientDashboard.
 *
 * Fetches the backend overview, maps it to the dashboard's ClientData shape, and
 * wires the live behaviours the sample preview doesn't have:
 *   - save edited Profile → PATCH /client/:id/profile (feeds the next run)
 *   - run / re-run + live run phase (first-run wizard + header control)
 *
 * This is the ONE real dashboard. The sample ClientDashboard is used only by the
 * auth-free /preview shell for demos.
 */
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGetClientOverview } from '@shared/hooks/rq/queries/useGetClientOverview';
import { useGetLatestRun } from '@shared/hooks/rq/queries/useGetLatestRun';
import { useTriggerRun } from '@shared/hooks/rq/mutations/useTriggerRun';
import { useEditClientProfile } from '@shared/hooks/rq/mutations/useEditClientProfile';
import { useQueryClient } from '@tanstack/react-query';
import { ClientDashboard, type ClientLive } from './ClientDashboard';
import { overviewToClientData } from './overviewToClientData';
import type { EditDraft } from './editable';

const ACTIVE = ['onboarding', 'onboarded', 'layer1', 'layer2', 'layer3'];

/** EditDraft (flat ClientProfile) → the PATCH body the backend expects. */
function draftToPatch(draft: EditDraft): Record<string, unknown> {
  const p = draft.profile;
  return {
    industry: draft.business.industry,
    brand: {
      description: p.description,
      valueProposition: p.valueProposition,
      differentiators: p.differentiators,
      personas: p.personas,
      voice: p.voice,
      contentThemes: p.contentThemes,
      products: p.products,
      guidelines: p.guidelines,
      languages: p.languages,
      markets: p.markets,
    },
    presence: {
      serviceAreas: p.serviceAreas,
      primaryCategory: p.primaryCategory,
      hours: p.hours,
      services: p.services,
      bookingUrl: p.bookingUrl,
      reviewProfiles: p.reviewProfiles,
    },
  };
}

export function ClientDashboardLive() {
  const { domain = '' } = useParams();
  const qc = useQueryClient();
  const { data: ov, isLoading } = useGetClientOverview(domain);
  const clientId = ov?.id ?? null;
  const { data: latestRun } = useGetLatestRun(clientId);
  const triggerRun = useTriggerRun();
  const editProfile = useEditClientProfile();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-20 text-brand-textMute">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="font-mono text-sm">Loading {domain}…</span>
      </div>
    );
  }
  if (!ov) {
    return <p className="py-20 font-mono text-sm text-brand-textMute">Client not found.</p>;
  }

  const data = overviewToClientData(ov);
  const hasRun = !!ov.latestManifest || !!ov.latestAudit;
  const runPhase = latestRun?.phase ?? null;
  const isRunning = !!runPhase && ACTIVE.includes(runPhase);

  const live: ClientLive = {
    hasRun,
    runPhase,
    isRunning,
    onRun: async () => {
      if (!clientId) return;
      await triggerRun.mutateAsync({ clientId });
      qc.invalidateQueries({ queryKey: ['runs', 'latest', clientId] });
    },
  };

  async function onSaveProfile(draft: EditDraft) {
    if (!clientId) return;
    // rerun:true — saving from the dashboard recomputes with the new profile.
    await editProfile.mutateAsync({ clientId, patch: draftToPatch(draft), rerun: true });
    qc.invalidateQueries({ queryKey: ['client', domain, 'overview'] });
  }

  return (
    <ClientDashboard
      data={data}
      live={live}
      onSaveProfile={onSaveProfile}
      backHref="/dashboard"
      backLabel="all clients"
    />
  );
}
